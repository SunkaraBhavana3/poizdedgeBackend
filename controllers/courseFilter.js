import Course from "../models/Course.js";

export const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    // Search courses dynamically
    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).select("courseId title category lecture price enrolledCount adminEmail"); 
    // returning only needed fields for filter

    res.json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
