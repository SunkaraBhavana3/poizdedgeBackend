import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Poizdedge Institute" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to", to);
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Email could not be sent");
  }
};
