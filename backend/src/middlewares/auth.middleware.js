import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;
  console.log("JWT token in middleware:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User in middleware:", req.user?.email); // 🔍
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.userId = req.user._id;

    next();
  } catch (err) {
    console.error("Error in auth middleware:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: err.message });
  }
};
