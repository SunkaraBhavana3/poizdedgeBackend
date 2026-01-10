import BrochureLead from "../models/Brochure.js";
import crypto from "crypto";
import path from "path";

export const requestAccess = async (req, res) => {
  const { email, phone } = req.body;

  const token = crypto.randomBytes(20).toString("hex");

  await BrochureLead.create({ email, phone, token });

  res.json({ token });
};

export const viewBrochure = async (req, res) => {
  const { token } = req.query;

  const lead = await BrochureLead.findOne({ token });

  if (!lead) {
    return res.status(401).send("Access Denied");
  }

  const filePath = path.resolve("uploads/Brochure.pdf");

  res.sendFile(filePath);
};
