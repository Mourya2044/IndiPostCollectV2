import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV !== "development"
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

    generateToken(user._id, res);

    res.status(200).json(user);
  } catch (err) {
    console.log("error in loginUser controller", err.message);
    return res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

export const signUpUser = async (req, res) => {
  const { fullName, email, password, address} = req.body;
  
  //verify all fields
  if (
    !address.locality || !address.city || !address.district || !address.state || !address.pin) {
    return res.status(400).json({ message: "All address fields are required" });
  }
  if(!fullName || !email || !password || !address ){
    return res.status(400).json({message: "All fields are required"});
  }
  try {
    const existingUser = await User.findOne({email});//If already exists
    if(existingUser){
      return res.status(400).json({message: "Email already in use"});
    }
    //Create user
    const user = await User.create({
      fullName,
      email,
      password,
      address: {
        locality: address.locality,
        city: address.city,
        district: address.district,
        state: address.state,
        pin: address.pin
      }
    });

    generateToken(user._id, res);

    res.status(201).json(user);
  } catch (err) {
    console.log("error in signUpUser controller", err.message);
    return res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
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

export const checkAuth = async (req,res) => {
  try{
    return res.status(200).json(req.user);
  }catch(err){
    console.log("Error checking authentication",err.message)
    return res.status(500).json({message: "Error checking authentication", error:err.message})
  }
}
