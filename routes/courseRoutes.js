import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

/* ============================================================
   1. Add New Course (course-level info only)
============================================================ */
router.post("/add", async (req, res) => {
  try {
    const { title, lecture, category, Subjects, duration, description, price, imageBase64 } = req.body;

    const course = new Course({
      title,
      lecture,
      category,
      Subjects,
      duration,
      description,
      price,
      imageBase64,
      modules: [], // initialize empty
    });

    await course.save();
    res.json({ message: "Course created successfully", course });
  } catch (error) {
    console.log("Add Course Error:", error);
    res.status(500).json({ message: "Failed to create course", error });
  }
});

/* ============================================================
   2. Get All Courses
============================================================ */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
});

/* ============================================================
   3. Get Single Course
============================================================ */
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
});

/* ============================================================
   4. Update Course
============================================================ */
router.put("/:courseId", async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate({ courseId: req.params.courseId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error });
  }
});

/* ============================================================
   5. Delete Course
============================================================ */
router.delete("/:courseId", async (req, res) => {
  try {
    const deleted = await Course.findOneAndDelete({ courseId: req.params.courseId });
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted", course: deleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error });
  }
});

/* ============================================================
   6. Add Module to Course (module-level info only)
============================================================ */
router.post("/:courseId/module/add", async (req, res) => {
  try {
    const { moduleTitle, moduleDescription } = req.body;

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId },
      { $push: { modules: { moduleTitle, moduleDescription, topics: [], quiz: [] } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Module added", course: updated });
  } catch (error) {
    console.log("Add Module Error:", error);
    res.status(500).json({ message: "Failed to add module", error });
  }
});

router.post("/:courseId/module/:moduleId/topic/add", async (req, res) => {
  try {
    const { topicName, video, material } = req.body;

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $push: { "modules.$.topics": { topicName, video, material } } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Course or Module not found" });
    res.json({ message: "Topic added", course: updated });
  } catch (error) {
    console.log("Add Topic Error:", error);
    res.status(500).json({ message: "Failed to add topic", error });
  }
});

/* ============================================================
   8. Add Quiz to Module
============================================================ */
router.post("/:courseId/module/:moduleId/quiz/add", async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $push: { "modules.$.quiz": { question, options, correctAnswer } } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Course or Module not found" });
    res.json({ message: "Quiz added", course: updated });
  } catch (error) {
    console.log("Add Quiz Error:", error);
    res.status(500).json({ message: "Failed to add quiz", error });
  }
});

/* ============================================================
   9. Update Module
============================================================ */
router.put("/:courseId/module/:moduleId", async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    Object.assign(module, req.body);
    await course.save();

    res.json({ message: "Module updated", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update module", error });
  }
});

/* ============================================================
   10. Delete Module
============================================================ */
router.delete("/:courseId/module/:moduleId", async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.modules = course.modules.filter((m) => m._id.toString() !== req.params.moduleId);
    await course.save();

    res.json({ message: "Module deleted", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete module", error });
  }
});

export default router;
