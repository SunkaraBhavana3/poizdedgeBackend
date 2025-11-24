// backend/models/Module.js
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "pdf", "quiz"], required: true },
  fileUrl: { type: String }, // Link to uploaded file
  duration: { type: String }, // e.g., "10 min"
  isFree: { type: Boolean, default: false }, // Free preview
});

const moduleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  lessons: [lessonSchema],
});

module.exports = mongoose.model("Module", moduleSchema);
