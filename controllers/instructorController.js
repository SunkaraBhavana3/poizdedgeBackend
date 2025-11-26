import Instructor from "../models/Instructor.js";

// Create a new instructor
export const createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json({ success: true, instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get all instructors
export const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json({ success: true, instructors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get instructor by ID
export const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }
    res.status(200).json({ success: true, instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Update instructor
export const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instructor) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }
    res.status(200).json({ success: true, instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Delete instructor
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }
    res.status(200).json({ success: true, message: "Instructor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
