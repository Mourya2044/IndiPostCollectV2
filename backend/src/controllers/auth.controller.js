import User from "../models/user.model.js";
import UserVerification from "../models/verification.model.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import cloudinary from '../lib/cloudinary.js';

// Generate JWT token
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  console.log("token", token);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,           // no HTTPS in localhost
    sameSite: "Lax",         // "None" requires HTTPS
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
    const hashedString = await bcrypt.hash(uniqueString,10);

    await UserVerification.create({
      userId: user._id,
      uniqueString: hashedString,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 6*60*60*1000), //6 hours expiry
    })
    
    //send verification email
    await sendVerificationEmail(user.email,uniqueString,user._id);

    res.status(201).json({
      message: "Verification email sent. Please verify your email.",
      userId: user._id,
      uniqueString, // ⚠️ Only for testing - REMOVE later
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
  const {userId, uniqueString} = req.params;

  try{
    const record = await UserVerification.findOne({userId});

  if(!record){
    return res.status(404).json({message: "Verification record not found or expired"});
  }

  if(record.expiresAt < Date.now()){
    await UserVerification.deleteOne({userId});
    await User.deleteOne({_id: userId});
    return res.status(400).json({message: "Link expired. Signup again"});
  }

  const isMatch = await bcrypt.compare(uniqueString,record.uniqueString);
  if(!isMatch){
    return res.status(401).json({ message: "Invalid verification link" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { verified: true },
    { new: true }
  ).select("-password");

  await UserVerification.deleteOne({userId});

  generateToken(updatedUser._id, res);
  res.status(200).json(updatedUser);
  
  }catch(err){
    console.error("Error in verifyEmail:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const updateProfilePic = async (req, res) => {
  try {
    const { image } = req.body; // This should be a base64 string or image URL

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    await cloudinary.uploader.destroy("profile_pics/"+req.user.profilePic.split("/profile_pics/")[1].replace(/\.(jpg|jpeg|png|webp)$/, ""));
    
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "profile_pics",
      allowed_formats: ["jpg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }]
    });

    // console.log("Upload response:", uploadResponse);
    
    const imageUrl = uploadResponse.secure_url;
    // console.log("Image URL:", "profile_pics/"+imageUrl.split("/profile_pics/")[1].replace(/\.(jpg|jpeg|png|webp)$/, ""));
    


    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile picture updated",
      user: updatedUser
    });

  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Server error" });
  }
};