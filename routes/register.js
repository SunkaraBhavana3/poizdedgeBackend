// routes/register.js
import express from "express";
import Register from "../models/Register.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  const { name, email, phone, profession, demo } = req.body;

  // Basic input validation
  if (!name || !email || !phone || !profession || !demo) {
    return res.status(400).json({
      success: false,
      message: "All fields are required (name, email, phone, profession, demo)",
    });
  }

  try {
    // Create new registration
    const registration = new Register({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      profession: profession.trim(),
      CourseDemo: demo.trim(),
    });

    // Save - MongoDB will throw duplicate error if email + CourseDemo already exists
    await registration.save();

    // Success response
    return res.status(201).json({
      success: true,
      message: `Successfully registered for "${demo}"!`,
      data: {
        name,
        email,
        demo,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `You are already registered for "${demo}" with this email.`,
      });
    }

    // Other errors (validation, DB connection, etc.)
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Optional: GET all registrations for a specific email (admin use only)
router.get("/by-email/:email", async (req, res) => {
  try {
    const registrations = await Register.find({ email: req.params.email.toLowerCase() }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
});

router.get("/my-demos", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const registrations = await Register.find(
      { email: email.toLowerCase().trim() },
      { CourseDemo: 1 } 
    ).lean();

    const registeredDemos = registrations.map((r) => r.CourseDemo);

    return res.json({
      success: true,
      registeredDemos,
    });
  } catch (err) {
    console.error("Failed to fetch user demos:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
