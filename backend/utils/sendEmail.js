require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Verify connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer Error:", error);
  } else {
    console.log("✅ Mailer Ready");
  }
});

const sendMail = async ({ email, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `PulseChat <${process.env.EMAIL}>`,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed");
    console.error(error);

    throw error;
  }
};

module.exports = sendMail;