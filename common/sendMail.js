require("dotenv").config(); // Load environment variables
const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;
const FROM_EMAIL = process.env.EMAIL_USER;

async function sendMail(to, subject, templateData) {
    if (!DOMAIN || !API_KEY || !FROM_EMAIL) {
        console.error("Missing Mailgun configuration. Check your .env file.");
        throw new Error("Mailgun configuration missing");
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: API_KEY,
    });

    // Embed the HTML template directly
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP for Password Reset - Emma Health</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 40px 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                    overflow: hidden;
                }
                .header {
                    background-color: #007bff;
                    padding: 20px;
                    font-size: 24px;
                    font-weight: bold;
                    color: #ffffff;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .otp-box {
                    background-color: #f8f9fa;
                    padding: 15px;
                    font-size: 32px;
                    font-weight: bold;
                    color: #007bff;
                    border-radius: 8px;
                    margin: 20px 0;
                    display: inline-block;
                    letter-spacing: 5px;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #555;
                    padding: 20px 0;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                @media (max-width: 600px) {
                    .container {
                        width: 90%;
                        padding: 20px;
                    }
                    .otp-box {
                        font-size: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Password Reset Request</div>
                <div class="content">
                    <p>Dear ${templateData.userName},</p>
                    <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                    <div class="otp-box">${templateData.otp}</div>
                    <p>This OTP is valid for <strong>${templateData.expirationTime}</strong>. If you did not request a password reset, please ignore this email.</p>
                    <p>For your security, do not share this OTP with anyone.</p>
                </div>
                <div class="footer">
                    <p>If you have any questions, feel free to <a href="mailto:info@emmahealth.com">contact our support team</a>.</p>
                    <p>&copy; 2024 Emma Health. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        console.log("Sending email to:", to);
        console.log("Using template data:", templateData);

        const result = await mg.messages.create(DOMAIN, {
            from: `Emma Health <${FROM_EMAIL}>`,
            to: [to],
            subject: subject,
            html: htmlTemplate,
        });

        console.log("Mailgun response:", result);
        return result;
    } catch (error) {
        console.error("Mailgun error:", error);
        throw error;
    }
}

module.exports = {
    sendMail,
};