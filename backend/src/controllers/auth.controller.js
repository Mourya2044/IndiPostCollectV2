import User from "../models/user.model.js";
import UserVerification from "../models/verification.model.js";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { sendResetPasswordEmail } from "../utils/sendResetEmail.js";
import cloudinary from '../lib/cloudinary.js';
import Token from "../models/token.model.js";

// Generate JWT token
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  //console.log("token", token);

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV !== "development" ? "None" : "Strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 24 * 60 * 60 * 1000
  });

  return token;
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //verify
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    //verify if user present or correct password
    if (!user || !(await user.comparePasswords(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    //is user verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email to login." });
    }
    generateToken(user._id, res);

    res.status(200).json(user);
  } catch (err) {
    console.log("error in loginUser controller", err.message);
    return res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

export const signUpUser = async (req, res) => {
  const { fullName, email, password, address } = req.body;

  //verify all fields
  if (
    !address || !address.locality || !address.city || !address.district || !address.state || !address.pin) {
    return res.status(400).json({ message: "All address fields are required" });
  }
  if (!fullName || !email || !password || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });//If already exists
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    //Create user
    const user = await User.create({
      fullName,
      email,
      password,
      verified: false,
      address: {
        locality: address.locality,
        city: address.city,
        district: address.district,
        state: address.state,
        pin: address.pin
      }
    });

    //Generate unique verification string
    const uniqueString = uuidv4() + user._id;
    const hashedString = await bcrypt.hash(uniqueString, 10);

    await UserVerification.create({
      userId: user._id,
      uniqueString: hashedString,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), //6 hours expiry
    })

    //send verification email
    await sendVerificationEmail(user.email, uniqueString, user._id);

    res.status(201).json({
      message: "Verification email sent. Please verify your email.",
      // userId: user._id,
      // uniqueString, // ⚠️ Only for testing - REMOVE later
    });

    /*generateToken(user._id, res);

    res.status(201).json(user);*/
  } catch (err) {
    console.log("error in signUpUser controller", err.message);
    return res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log("error in logoutUser controller", err.message);
    return res.status(500).json({ message: "Logout failed", error: err.message });
  }
};


export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log("error in getUserInfo controller", err.message);
    return res.status(500).json({ message: "Error getting user information", error: err.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.log("Error checking authentication", err.message)
    return res.status(500).json({ message: "Error checking authentication", error: err.message })
  }
}

export const verifyEmail = async (req, res) => {
  const { userId, uniqueString } = req.params;

  try {
    const record = await UserVerification.findOne({ userId });

    if (!record) {
      return res.status(404).json({ message: "Verification record not found or expired" });
    }

    if (record.expiresAt < Date.now()) {
      await UserVerification.deleteOne({ userId });
      await User.deleteOne({ _id: userId });
      return res.status(400).json({ message: "Link expired. Signup again" });
    }

    const isMatch = await bcrypt.compare(uniqueString, record.uniqueString);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid verification link" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    ).select("-password");

    await UserVerification.deleteOne({ userId });

    generateToken(updatedUser._id, res);
    res.status(200).json(updatedUser);

  } catch (err) {
    console.error("Error in verifyEmail:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const updateProfilePic = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // 🌟 Safely destroy old image if it exists
    const profilePic = req.user.profilePic;
    if (profilePic && profilePic.includes("/profile_pics/")) {
      const publicId = profilePic
        .split("/profile_pics/")[1]
        .replace(/\.(jpg|jpeg|png|webp)$/, "");
      await cloudinary.uploader.destroy("profile_pics/" + publicId);
    }

    // Upload new image
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "profile_pics",
      allowed_formats: ["jpg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    const imageUrl = uploadResponse.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile picture updated",
      user: updatedUser,
    });

  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try{
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found with this mail"});
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await Token.deleteMany({ userId: user._id });

    const token = await Token.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
    });

    const resetUrl = `/forget-password/${resetToken}`

    const message = `
      You requested a password reset. Click the link below to reset your password:
      ${resetUrl}
      This link expires in 15 minutes.
      If you didn't request this, you can ignore this email.
    `;

    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err){
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleResetPassword = async (req,res) => {
  try{
    const {password} = req.body;
    const resetToken = req.params.token;

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or missing token" });
    }
    
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const tokenDoc = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() }
    })

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();
    
    await Token.deleteOne({ _id: tokenDoc._id });

    return res.status(200).json({ message: "Password successfully reset" });
  }catch(err){
    console.error("Reset error:", err);
    return res.status(500).json({message: "Server Error"})
  }
}

export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "No address provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { address },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Address updated",
      user: updatedUser,
    });

  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ message: "Server error" });
  }
}