import express from "express";
import { 
  createInstructor, 
  getInstructors, 
  getInstructorById, 
  updateInstructor, 
  deleteInstructor 
} from "../controllers/instructorController.js";

const router = express.Router();

router.post("/", createInstructor);        // Create
router.get("/", getInstructors);          // Get all
router.get("/:id", getInstructorById);    // Get by ID
router.put("/:id", updateInstructor);     // Update
router.delete("/:id", deleteInstructor);  // Delete

export default router;
