import mongoose from "mongoose";

const brochureSchema = new mongoose.Schema({
  email: String,
  phone: String,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 } // 1 hour token expiry
});

export default mongoose.model("BrochureLead", brochureSchema);
