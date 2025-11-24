// controllers/courseController.js
import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { title, lecture, duration, description, price, image } = req.body;

    const course = new Course({
      title,
      lecture,
      duration,
      description,
      price,
      image
    });

    await course.save();

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const data = await Course.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
