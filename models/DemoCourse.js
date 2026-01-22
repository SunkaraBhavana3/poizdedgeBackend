import mongoose from "mongoose";

const demoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    demoTime: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Demo", demoSchema);
