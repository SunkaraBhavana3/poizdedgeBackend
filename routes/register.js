import express from "express";
import User from "../models/Register.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  console.log("📩 Incoming registration request:", req.body);

  const { name, email, phone, profession, demo } = req.body;

  if (!name || !email || !phone || !profession || !demo) {
    console.log("❌ Registration failed: Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the same user already registered for the same demo
    const existingUser = await User.findOne({ email, CourseDemo: demo });
    if (existingUser) {
      console.log("⚠️ User already registered for this demo:", email, demo);
      return res.status(400).json({ message: "You have already registered for this demo." });
    }

    // Save new registration
    const user = new User({
      name,
      email,
      phone,
      profession,
      CourseDemo: demo,
    });

    const savedUser = await user.save();
    console.log("✅ User saved successfully:", savedUser._id);

    // Fast response
    res.status(201).json({
      message: "Successfully registered! Confirmation email will be sent shortly.",
    });

    // Send confirmation email asynchronously
    const emailContent = `
      <h2>Welcome to Poizdedge Institute, ${name}!</h2>
      <p>You have successfully registered for the <b>${demo}</b> demo.</p>
      <p>We are excited to have you on board!</p>
      <p>Regards,<br/>Poizdedge Institute</p>
    `;

    sendEmail(email, `Registration Successful - ${demo} Demo`, emailContent)
      .then(() => console.log("📨 Email sent in background"))
      .catch((err) => console.error("❌ Email failed in background:", err));

  } catch (error) {
    console.error("❌ Server Error during registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
