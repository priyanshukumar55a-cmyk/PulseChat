require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendMail = async ({ email, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `PulseChat <${process.env.EMAIL}>`,
      to: email,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = sendMail;