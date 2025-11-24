import Course from "../models/Course.js";

export const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
