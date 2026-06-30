require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.EMAIL_PASS);

const sendMail = async ({ email, subject, html }) => {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    html,
  });

  console.log(response);

  return response;
};

module.exports = sendMail;
