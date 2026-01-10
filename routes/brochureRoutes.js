import express from "express";
import { requestAccess, viewBrochure } from "../controllers/brochureController.js";

const router = express.Router();

router.post("/request-access", requestAccess);
router.get("/view", viewBrochure);

export default router;
