import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
dotenv.config();

// Verify if the user is logged in and extract the role
const verifyToken = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to restrict access to users with role 'user'
const isUser = async (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied, user role required" });
  }
  next();
};

// Middleware to restrict access to users with role 'admin'
const isAdmin = async (req, res, next) => {
  const admin = await Admin.findById(req.user._id);
  if (!admin || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied, admin role required" });
  }
  next();
};

export { verifyToken, isUser, isAdmin };
