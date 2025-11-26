import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import registerRoutes from "./routes/register.js";
import authRoutes from "./routes/authRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";

import courseFilterRoutes from "./routes/courseFilterRoutes.js";
dotenv.config();
connectDB();


const app = express();
app.use(express.json({ limit: "10mb" })); // ⚡ allows base64 image
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/courses", courseFilterRoutes);
app.use("/api/instructors", instructorRoutes);

app.use("/api", enrollmentRoutes);
const PORT = 5000;
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
