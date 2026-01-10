import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import registerRoutes from "./routes/register.js";
import authRoutes from "./routes/authRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import Course from "./routes/courseRoutes.js";
import courseFilterRoutes from "./routes/courseFilterRoutes.js";
dotenv.config();
connectDB();
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
app.use(express.json({ limit: "10mb" })); // ⚡ allows base64 image
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/course", courseRoutes);
app.use("/api/courses", courseFilterRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/stats", statsRoutes);
const BrochureSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phone: String,
  date: { type: Date, default: Date.now }
});

const Brochure = mongoose.model("Brochure", BrochureSchema);

// Save details
app.post("/api/brochure/save", async (req, res) => {
  const { email, phone } = req.body;

  try {
    // Save only unique emails
    await Brochure.updateOne(
      { email },
      { email, phone },
      { upsert: true }
    );

    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database Error" });
  }
});app.use("/api", enrollmentRoutes);
const PORT = 5000;
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);