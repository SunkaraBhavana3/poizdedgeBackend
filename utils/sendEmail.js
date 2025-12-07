import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  console.log("📤 Attempting to send email to:", to);

  // Validate ENV
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP CREDENTIALS MISSING in environment variables");
    throw new Error("SMTP configuration missing");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Required on Render for Gmail
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Poizdedge Institute" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;

  } catch (err) {
    console.error("❌ Email sending error details:");
    console.error("→ Message:", err.message);
    console.error("→ Code:", err.code);
    console.error("→ Command:", err.command);
    console.error("→ Response:", err.response);
    console.error("→ Stack:", err.stack);
    throw err;
  }
};
