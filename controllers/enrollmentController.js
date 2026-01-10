import Enrollment from "../models/Enrollment.js";

export const submitEnrollment = async (req, res) => {
    try {
        const enrollment = new Enrollment(req.body);
        await enrollment.save();
        res.status(200).json({ success: true, message: "Enrollment successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
