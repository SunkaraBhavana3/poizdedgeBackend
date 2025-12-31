// src/routes/auth.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

/* ----------------------------------------------
   VERIFY TOKEN (Middleware)
------------------------------------------------*/
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided ❌" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found ❌" });

    req.user = user;
    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

/* ----------------------------------------------
   VERIFY ADMIN
------------------------------------------------*/
export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin)
    return res.status(403).json({ message: "Admin access only ❌" });
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
    if (existingUser)
      return res.status(400).json({ message: "Email already exists ❌" });

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
    console.error("Register error:", error);
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
    if (!user)
      return res.status(400).json({ message: "Invalid Email ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password ❌" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login Successful ✅", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------------------------
   FORGOT PASSWORD — send token to email
------------------------------------------------*/
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required ❌" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found ❌" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // MUST be an App Password ❗
      },
    });

    const mailOptions = {
      from: `PoizdEdge Institute <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Your Password Reset Token",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>Use the token below to reset your password:</p>

        <h3 style="color:#1E3A8A">${resetToken}</h3>

        <p>This token is valid for <strong>15 minutes</strong>.</p>
        <p>Enter this token in the password reset form.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset token sent to email 💙" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      message: "Error sending reset token ❌",
      error: err.message,
    });
  }
});

/* ----------------------------------------------
   RESET PASSWORD — frontend sends token + new password
------------------------------------------------*/
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: "Token & password required ❌" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: "Invalid or expired token ❌",
      });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful 💙" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Server error ❌",
      error: err.message,
    });
  }
});

/* ----------------------------------------------
   GET USER DETAILS
------------------------------------------------*/
router.get("/me", verifyToken, async (req, res) => {
  res.json({ message: "User fetched", user: req.user });
});

export default router;
