const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail", // You can use any email service provider (Gmail, Outlook, etc.)
        auth: {
            user: process.env.EMAIL_USER, // Email address from which the email will be sent
            pass: process.env.EMAIL_PASS, // Email password or app-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to, // receiver's email
        subject, // subject line
        text, // plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
