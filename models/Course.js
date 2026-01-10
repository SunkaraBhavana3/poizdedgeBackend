import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const topicSchema = new mongoose.Schema({
  topicId: { type: String, default: uuidv4 },
  topicName: { type: String, required: true },
  video: {
    url: { type: String },       // optional YouTube URL
    uploadedFile: { type: String } // optional base64 video upload
  },
  materials: [
    {
      content: { type: String },
      fileUrl: { type: String } // PDF / DOC base64
    }
  ]
});

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true }
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, default: uuidv4 },
  moduleTitle: { type: String, required: true },
  moduleDescription: { type: String },
  topics: [topicSchema],
  quiz: [quizSchema]
});

const courseSchema = new mongoose.Schema(
  {
    courseId: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    lecture: { type: String, required: true },
    category: { type: String, required: true },
    Subjects: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageBase64: { type: String, required: true },
    modules: [moduleSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);