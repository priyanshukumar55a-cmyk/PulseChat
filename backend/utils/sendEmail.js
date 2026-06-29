const {Resend} = require("resend");

const resend = new Resend(
    process.env.EMAIL_PASS,
);

const sendMail = async ({ email, subject, html }) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    html,
  });
};

module.exports = sendMail;
