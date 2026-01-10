import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ------------------------------------------------
   SIGN UP
   Save user profile in MongoDB
-------------------------------------------------*/
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      courseOfInterest,
      highestQualification,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !courseOfInterest ||
      !highestQualification
    ) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      course: courseOfInterest,
      qualification: highestQualification,
      isAdmin: email === "bhavanasunkara5@gmail.com",
    });

    res.status(201).json({
      message: "Signup successful ✅",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ------------------------------------------------
   SIGN IN
   Just fetch user profile from MongoDB
-------------------------------------------------*/
router.post("/signin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required ❌" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json({
      message: "Login successful ✅",
      user,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ------------------------------------------------
   ADMIN-ONLY ROUTE
   Example: get total users
-------------------------------------------------*/
router.get("/admin/dashboard", async (req, res) => {
  try {
    const { email } = req.query; // frontend sends logged-in email

    if (!email) {
      return res.status(401).json({ message: "Email required ❌" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access only ❌" });
    }

    // Example: total users
    const totalUsers = await User.countDocuments();

    res.json({
      message: "Welcome Admin ✅",
      data: { totalUsers },
    });
  } catch (error) {
    console.error("Admin route error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

/* ------------------------------------------------
   GET CURRENT USER BY EMAIL
-------------------------------------------------*/
router.get("/me/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;
