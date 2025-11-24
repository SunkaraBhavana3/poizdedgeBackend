import express from "express";
import User from "../models/Register.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// POST /api/register
router.post("/", async (req, res) => {
  const { name, email, phone, profession,demo } = req.body;

  if (!name || !email || !phone || !profession || !req.body.demo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({ name, email, phone, profession, CourseDemo: demo });
    await user.save();

    // Send confirmation email
    const emailContent = `
      <h2>Welcome to Poizdedge Institute, ${name}!</h2>
      <p>You have successfully registered for the <b>Free Demo</b>.</p>
      <p>We are excited to have you on board!</p>
      <p>Regards,<br/>Poizdedge Institute</p>
    `;

    await sendEmail(email, "Registration Successful - Free Demo", emailContent);

    res.status(201).json({ message: "Successfully registered! Confirmation email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
