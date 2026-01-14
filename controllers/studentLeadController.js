import StudentLead from "../models/StudentLead.js";

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, plan } = req.body;

    // validation
    if (!name || !email || !phone || !plan) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const lead = new StudentLead({
      name,
      email,
      phone,
      plan,
    });

    await lead.save();

    return res.status(201).json({
      success: true,
      message: "Lead saved successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lead not saved",
    });
  }
};
