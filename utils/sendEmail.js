
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    
  const msg = {
    to: options.email, // Change to your recipient
    from: "noreply@speaqs.io", // Change to your verified sender
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error.message);
    });
};
module.exports = sendEmail;