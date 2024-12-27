const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Set up OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Get a new access token using the refresh token
    const accessToken = await oauth2Client.getAccessToken();

    // Configure the transporter with Gmail and OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // Access token from OAuth2 client
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, // Recipient email address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body (optional)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Failed to send email: ", error);
    return false;
  }
};

module.exports = { sendEmail };
