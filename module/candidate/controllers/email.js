// const nodemailer = require("nodemailer");

// // Create reusable transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//     port: 587,
//     secure:false,
//   auth: {
//     user: "reenatanchak@gmail.com", //  Gmail  id
//     pass: "iupl oywm vloz ybec",   // your App Password 
//   },

// });
//   console.log("node mailer is working");


// const sendMail = async (to, subject, text, html = null) => {
//   try {
//     const mailOptions = {
//       from: "reenatanchak@gmail.com",
//       to,
//       subject,
//       text,
//       ...(html && { html }), // add html only if provided
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//     return info;
//   } catch (error) {
//     console.error(" Error sending email:", error);
//     throw error;
//   }
// };

// module.exports = sendMail;
const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "reenatanchak@gmail.com", // Gmail account
    pass: "iupl oywm vloz ybec",    // App password (DO NOT use real Gmail password)
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
      ...(html && { html }), // only include html if provided
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
