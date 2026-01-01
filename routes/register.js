import express from "express";
import User from "../models/Register.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  console.log("📩 Incoming registration request body:", req.body);

  try {
    const { name, email, phone, profession, demo } = req.body;

    // Validate input
    if (!name || !email || !phone || !profession || !demo) {
      console.log("❌ Missing fields:", {
        name,
        email,
        phone,
        profession,
        demo,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("🔍 Checking existing user for same demo...");
    const existingUser = await User.findOne({
      email,
      CourseDemo: demo,
    });

    if (existingUser) {
      console.log("⚠️ Duplicate registration detected");
      return res
        .status(400)
        .json({ message: "You already registered for this demo." });
    }

    console.log("📝 Creating new user document...");
    const user = new User({
      name,
      email,
      phone,
      profession,
      CourseDemo: demo, // ✅ IMPORTANT FIX
    });

    console.log("💾 Saving to MongoDB...");
    const savedUser = await user.save();

    console.log("✅ User saved successfully:", savedUser._id);

    return res.status(201).json({
      message: "Successfully registered!",
    });
  } catch (error) {
    console.error("🔥 ACTUAL SERVER ERROR:", error.message);
    console.error(error.stack); // full trace
    return res.status(500).json({ message: error.message });
  }
});

export default router;
