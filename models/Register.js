import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true }, // removed unique: true
    phone: { type: String, required: true },
    profession: { type: String, required: true },
    CourseDemo: { type: String, required: true },
  },
  { timestamps: true } // optional: tracks createdAt/updatedAt
);

export default mongoose.model("Register", userSchema);
