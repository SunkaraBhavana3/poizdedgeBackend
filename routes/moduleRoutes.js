const express = require("express");
const router = express.Router();
const { getModules, createModule, addLesson } = require("../controllers/moduleController");

// CRUD Endpoints
router.get("/", getModules);
router.post("/", createModule);
router.post("/:moduleId/lessons", addLesson);

module.exports = router;
