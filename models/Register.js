// models/Register.js
import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
    },
    CourseDemo: {
      type: String,
      required: [true, "Please select a demo/course"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

registerSchema.index({ email: 1, CourseDemo: 1 }, { unique: true });

export default mongoose.model("Register", registerSchema);
