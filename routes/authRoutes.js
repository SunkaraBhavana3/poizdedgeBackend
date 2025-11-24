import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ----------------------------------------------
   VERIFY TOKEN (Middleware)
   - Attaches full user to req.user
------------------------------------------------*/
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    req.user = user; // attach full user
    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

/* ----------------------------------------------
   VERIFY ADMIN (Middleware)
------------------------------------------------*/
export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied: Admin only ❌" });
  }
  next();
};

/* ----------------------------------------------
   REGISTER USER
------------------------------------------------*/
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      courseOfInterest,
      highestQualification,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      course: courseOfInterest,
      qualification: highestQualification,
      password: hashedPassword,
      isAdmin: email === "bhavanasunkara5@gmail.com",
    });

    res.status(201).json({
      message: "Registration Successful ✅",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------------------------
   LOGIN USER
------------------------------------------------*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password ❌" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Successful ✅",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------------------------
   GET LOGGED-IN USER DETAILS (PROTECTED)
------------------------------------------------*/
router.get("/me", verifyToken, async (req, res) => {
  try {
    res.json({ message: "User fetched", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
