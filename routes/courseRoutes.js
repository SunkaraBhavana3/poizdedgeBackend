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
    res.status(500).json({ message: "Failed to create course", error: error.message });
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
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
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
    res.status(500).json({ message: "Error fetching course", error: error.message });
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
    res.status(500).json({ message: "Failed to update course", error: error.message });
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
    res.status(500).json({ message: "Failed to delete course", error: error.message });
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
    res.status(500).json({ message: "Failed to add module", error: error.message });
  }
});

/* ============================================================
   7. Add Topic to Module
============================================================ */
router.post("/:courseId/module/:moduleId/topic/add", async (req, res) => {
  try {
    const { topicName, video, materials } = req.body; // Fixed: materials (plural)

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $push: { "modules.$.topics": { topicName, video, materials } } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Course or Module not found" });
    res.json({ message: "Topic added", course: updated });
  } catch (error) {
    console.log("Add Topic Error:", error);
    res.status(500).json({ message: "Failed to add topic", error: error.message });
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
    res.status(500).json({ message: "Failed to add quiz", error: error.message });
  }
});

 /* ============================================================
   9. Update Module (FIXED)
============================================================ */
router.put("/:courseId/module/:moduleId", async (req, res) => {
  try {
    const { moduleTitle, moduleDescription } = req.body;

    const updated = await Course.findOneAndUpdate(
      {
        courseId: req.params.courseId,
        "modules.moduleId": req.params.moduleId
      },
      {
        $set: {
          "modules.$.moduleTitle": moduleTitle,
          "modules.$.moduleDescription": moduleDescription
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Course or Module not found"
      });
    }

    res.json({
      message: "Module updated successfully",
      course: updated
    });

  } catch (error) {
    console.log("Update Module Error:", error);
    res.status(500).json({
      message: "Failed to update module",
      error: error.message
    });
  }
});


/* ============================================================
   10. Delete Module (IMPROVED)
============================================================ */
router.delete("/:courseId/module/:moduleId", async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate(
      {
        courseId: req.params.courseId,
        "modules.moduleId": req.params.moduleId
      },
      {
        $pull: {
          modules: {
            moduleId: req.params.moduleId
          }
        }
      },
      {
        new: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Course or Module not found"
      });
    }

    res.json({
      message: "Module deleted successfully",
      course: updated
    });

  } catch (error) {
    console.log("Delete Module Error:", error);
    res.status(500).json({
      message: "Failed to delete module",
      error: error.message
    });
  }
});

/* ============================================================
   11. Update Topic in Module
============================================================ */
router.put("/:courseId/module/:moduleId/topic/:topicId", async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $set: { "modules.$.topics.$[topic]": req.body } },
      { arrayFilters: [{ "topic.topicId": req.params.topicId }], new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Course, Module, or Topic not found" });
    res.json({ message: "Topic updated", course: updated });
  } catch (error) {
    console.log("Update Topic Error:", error);
    res.status(500).json({ message: "Failed to update topic", error: error.message });
  }
});

/* ============================================================
   12. Delete Topic from Module
============================================================ */
router.delete("/:courseId/module/:moduleId/topic/:topicId", async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $pull: { "modules.$.topics": { topicId: req.params.topicId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course, Module, or Topic not found" });
    res.json({ message: "Topic deleted", course: updated });
  } catch (error) {
    console.log("Delete Topic Error:", error);
    res.status(500).json({ message: "Failed to delete topic", error: error.message });
  }
});

/* ============================================================
   13. Update Quiz in Module
============================================================ */
router.put("/:courseId/module/:moduleId/quiz/:quizId", async (req, res) => {
  try {
    // Note: quizSchema doesn't have a quizId field; using _id (ObjectId) for quiz items
    const quizId = req.params.quizId; // Assume this is the _id string

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $set: { "modules.$.quiz.$[quiz]": req.body } },
      { arrayFilters: [{ "quiz._id": quizId }], new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Course, Module, or Quiz not found" });
    res.json({ message: "Quiz updated", course: updated });
  } catch (error) {
    console.log("Update Quiz Error:", error);
    res.status(500).json({ message: "Failed to update quiz", error: error.message });
  }
});

/* ============================================================
   14. Delete Quiz from Module
============================================================ */
router.delete("/:courseId/module/:moduleId/quiz/:quizId", async (req, res) => {
  try {
    // Note: using _id for quiz items
    const quizId = req.params.quizId; // Assume this is the _id string

    const updated = await Course.findOneAndUpdate(
      { courseId: req.params.courseId, "modules.moduleId": req.params.moduleId },
      { $pull: { "modules.$.quiz": { _id: quizId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course, Module, or Quiz not found" });
    res.json({ message: "Quiz deleted", course: updated });
  } catch (error) {
    console.log("Delete Quiz Error:", error);
    res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
});

export default router;
