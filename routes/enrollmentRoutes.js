import express from "express";
import { submitEnrollment } from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/enroll", submitEnrollment);

export default router;
