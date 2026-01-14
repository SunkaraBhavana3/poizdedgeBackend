import mongoose from "mongoose";

const studentLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    plan: { type: String, required: true },
  },
  { timestamps: true }
);

const StudentLead = mongoose.model("StudentLead", studentLeadSchema);

export default StudentLead;
