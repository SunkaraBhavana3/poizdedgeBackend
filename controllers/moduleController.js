const Module = require("../models/Module");

// Get all modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new module
exports.createModule = async (req, res) => {
  try {
    const newModule = new Module(req.body);
    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a lesson to a module
exports.addLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    module.lessons.push(req.body); // req.body contains lesson info
    await module.save();
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
