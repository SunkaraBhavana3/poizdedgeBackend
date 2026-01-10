import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false }, // URL or base64
  role: { type: String, required: true },   // e.g., "Senior Web Developer"
  experience: { type: String, required: true } // paragraph about experience
}, { timestamps: true });

export default mongoose.model("Instructor", instructorSchema);
