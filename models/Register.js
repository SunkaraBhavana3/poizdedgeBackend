import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  profession: { type: String, required: true },
  CourseDemo: { type: String, required: true },
});

export default mongoose.model("Register", userSchema);
