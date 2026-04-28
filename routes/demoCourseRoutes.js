// routes/demoRoutes.js
import express from "express";
import Demo from "../models/DemoCourse.js";

const router = express.Router();

// Helper to safely convert demoDate
const prepareDemoData = (body) => {
  const demoData = { ...body };
  
  if (demoData.demoDate) {
    const parsedDate = new Date(demoData.demoDate);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid demoDate format. Please use YYYY-MM-DD");
    }
    demoData.demoDate = parsedDate;
  }
  
  return demoData;
};

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const demoData = prepareDemoData(req.body);
    const demo = await Demo.create(demoData);
    res.status(201).json(demo);
  } catch (error) {
    console.error("Demo Create Error:", error.message);
    res.status(400).json({ 
      message: error.message || "Failed to create demo" 
    });
  }
});

/* GET ALL */
router.get("/", async (_req, res) => {
  try {
    const demos = await Demo.find().sort({ demoDate: 1 });
    res.json(demos);
  } catch (error) {
    console.error("Demo Get Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* GET BY STATUS */
router.get("/status/:status", async (req, res) => {
  try {
    const demos = await Demo.find({ status: req.params.status })
      .sort({ demoDate: 1 });
    res.json(demos);
  } catch (error) {
    console.error("Demo Get Status Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const demoData = prepareDemoData(req.body);

    const demo = await Demo.findByIdAndUpdate(
      req.params.id,
      demoData,
      { new: true, runValidators: true }
    );

    if (!demo) {
      return res.status(404).json({ message: "Demo not found" });
    }

    res.json(demo);
  } catch (error) {
    console.error("Demo Update Error:", error.message);
    res.status(400).json({ 
      message: error.message || "Failed to update demo" 
    });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const demo = await Demo.findByIdAndDelete(req.params.id);
    if (!demo) {
      return res.status(404).json({ message: "Demo not found" });
    }
    res.json({ message: "Demo deleted successfully" });
  } catch (error) {
    console.error("Demo Delete Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
