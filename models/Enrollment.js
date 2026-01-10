import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { collection: "enrollments" }); // <-- use exact collection name in MongoDB

export default mongoose.model("Enrollment", enrollmentSchema);
