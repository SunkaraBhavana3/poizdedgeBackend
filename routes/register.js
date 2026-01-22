import express from "express";
import Register from "../models/Register.js"; // renamed model for clarity

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  const { name, email, phone, profession, demo } = req.body;

  // Quick upfront validation
  if (!name || !email || !phone || !profession || !demo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing email (fast indexed query)
    const existing = await Register.findOne({ email }).lean(); // .lean() = faster, plain JS object
    if (existing) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    // Create and save new registration
    const newReg = new Register({
      name,
      email,
      phone,
      profession,
      CourseDemo: demo, // matches schema field name
    });

    await newReg.save();

    // Success - no email, instant response
    return res.status(201).json({
      message: "Registration successful!",
      data: { name, email, demo },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key error (MongoDB E11000)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
