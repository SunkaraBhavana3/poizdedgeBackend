import express from "express";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getStats); // GET /api/stats

export default router;
