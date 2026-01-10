import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ----------------------------------------------
   VERIFY TOKEN (Middleware)
------------------------------------------------*/
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token provided ❌" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch full user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found ❌" });

    req.user = user; // full user attached
    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};