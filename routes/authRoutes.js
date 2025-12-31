import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

/* --------------------------------
   SMTP TRANSPORTER (WITH LOGS)
---------------------------------*/
const createTransporter = async () => {
  console.log("📧 SMTP USER:", process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  await transporter.verify();
  console.log("✅ SMTP VERIFIED");

  return transporter;
};

/* --------------------------------
   REGISTER + WELCOME EMAIL
---------------------------------*/
router.post("/register", async (req, res) => {
  console.log("➡️ /register HIT");

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

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists ❌" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      course: courseOfInterest,
      qualification: highestQualification,
      password: hashed,
      isAdmin: email === "bhavanasunkara5@gmail.com",
    });

    console.log("✅ USER SAVED");

    /* -------- SEND EMAIL -------- */
    try {
      const transporter = await createTransporter();

      const info = await transporter.sendMail({
        from: `"PoizdEdge Institute" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Welcome to PoizdEdge Institute 🎓",
        html: `
          <h2>Welcome ${user.firstName}!</h2>
          <p>Your registration is successful.</p>
          <p><strong>Course:</strong> ${user.course}</p>
        `,
      });

      console.log("📨 EMAIL SENT:", info.messageId);
    } catch (mailErr) {
      console.error("❌ EMAIL FAILED:", mailErr.message);
    }

    res.status(201).json({
      message: "Registration Successful ✅",
      user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------------
   LOGIN
---------------------------------*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email ❌" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password ❌" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful ✅", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------------
   FORGOT PASSWORD
---------------------------------*/
router.post("/forgot-password", async (req, res) => {
  console.log("➡️ /forgot-password HIT");

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found ❌" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"PoizdEdge Institute" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Token",
      html: `<h2>Your Token</h2><h3>${token}</h3>`,
    });

    res.json({ message: "Reset token sent ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
