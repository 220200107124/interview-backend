
// module.exports = sendMail;
const nodemailer = require("nodemailer");
require('dotenv').config();

// Create reusable transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   secure: false, 
//   auth: {
//     user: "reenatanchak@gmail.com", // Gmail account
//     pass: "iupl oywm vloz ybec",    // App password 
//   },
// });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
    },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer verification failed:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

// sendMail function
const sendMail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: '"Quiz Admin" <reenatanchak@gmail.com>',
      to,
      subject,
      text,
      ...(html && { html }), 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
