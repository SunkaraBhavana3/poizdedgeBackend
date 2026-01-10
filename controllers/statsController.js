import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Instructor from "../models/Instructor.js";

export const getStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalInstructors = await Instructor.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalInstructors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
