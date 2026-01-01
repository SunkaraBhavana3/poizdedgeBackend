import express from "express";
import User from "../models/Register.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  console.log("📩 Incoming registration request:", req.body);

  const { name, email, phone, profession, demo } = req.body;

  if (!name || !email || !phone || !profession || !demo) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Prevent duplicate demo registration
    const existingUser = await User.findOne({ email, CourseDemo: demo });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "You have already registered for this demo." });
    }

    const user = new User({
      name,
      email,
      phone,
      profession,
      CourseDemo: demo,
    });

    await user.save();
    console.log("✅ User saved:", user._id);

    res.status(201).json({
      message: "Successfully registered for the demo!",
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
