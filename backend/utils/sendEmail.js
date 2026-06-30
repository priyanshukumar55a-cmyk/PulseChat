require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: `PulseChat <${process.env.EMAIL}>`,
    to: email,
    subject,
    html,
  });
};

module.exports = sendMail;