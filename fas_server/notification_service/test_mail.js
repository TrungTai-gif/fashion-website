import nodemailer from "nodemailer";

const host = "smtp.gmail.com";
const port = 587;
const user = "nguyentai2292005@gmail.com";
const pass = "trywnopidixkuljd";

const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // true for 465, false for other ports like 587
    auth: { user, pass },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error("Connection error:", error);
    process.exit(1);
  } else {
    console.log("Server is ready to take our messages. Connection successful!");
    
    // Optional: send a test email
    transporter.sendMail({
      from: '"Test" <nguyentai2292005@gmail.com>',
      to: "nguyentai2292005@gmail.com",
      subject: "Test Email from Notification Service",
      text: "If you receive this, the email notification service works!",
    }, (err, info) => {
       if (err) {
         console.error("Error sending test mail:", err);
       } else {
         console.log("Test email sent:", info.response);
       }
       process.exit(0);
    });
  }
});
