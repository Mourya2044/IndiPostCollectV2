import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePasswords(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: err.message });
  }
};

export const signupUser = async (req, res) => {
  try {
    // Logic for user signup
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
