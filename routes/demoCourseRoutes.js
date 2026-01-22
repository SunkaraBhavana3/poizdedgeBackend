import express from "express";
import Demo from "../models/DemoCourse.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const demo = await Demo.create(req.body);
  res.json(demo);
});

router.get("/", async (_req, res) => {
  res.json(await Demo.find().sort({ createdAt: 1 }));
});

router.put("/:id", async (req, res) => {
  const demo = await Demo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(demo);
});

router.delete("/:id", async (req, res) => {
  await Demo.findByIdAndDelete(req.params.id);
  res.json({ message: "Demo deleted" });
});

export default router;
