import express from "express";
import User from "../models/Register.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  console.log("📩 Incoming registration request:", req.body);

  const { name, email, phone, profession, demo } = req.body;

  // Validate input
  if (!name || !email || !phone || !profession || !demo) {
    console.log("❌ Registration failed: Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Save user
    const user = new User({
      name,
      email,
      phone,
      profession,
      CourseDemo: demo,
    });

    const savedUser = await user.save();
    console.log("✅ User saved successfully:", savedUser._id);

    // FAST response to frontend
    res.status(201).json({
      message: "Successfully registered! Confirmation email will be sent shortly.",
    });

    // Email send (non-blocking)
    const emailContent = `
      <h2>Welcome to Poizdedge Institute, ${name}!</h2>
      <p>You have successfully registered for the <b>Free Demo</b>.</p>
      <p>We are excited to have you on board!</p>
      <p>Regards,<br/>Poizdedge Institute</p>
    `;

    sendEmail(email, "Registration Successful - Free Demo", emailContent)
      .then(() => console.log("📨 Email sent in background"))
      .catch((err) => console.error("❌ Email failed in background:", err));

  } catch (error) {
    console.error("❌ Server Error during registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
