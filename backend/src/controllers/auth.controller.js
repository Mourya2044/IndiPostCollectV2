import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

export const signUpUser = async (req, res) => {
  const { fullName, email, password, address, district, state, city, pin} = req.body;
  //verify all fields
  if(!fullName || !email || !password || !address || !district || !state || !city || !pin){
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
      address,
      district,
      state,
      city,
      pin
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed",error: err.message });
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
    res.status(500).json({ message: "Error getting user information", error: err.message });
  }
};
