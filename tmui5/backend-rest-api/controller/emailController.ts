import nodemailer from "nodemailer";
import { google } from "googleapis";
import { Request, Response } from "express";

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
const EMAIL_USER = process.env.EMAIL_USER as string;

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

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<boolean> => {
  try {
    // Get a new access token using the refresh token
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error("Failed to retrieve access token");
    }

    // Configure the transporter with Gmail and OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Define the email options
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text,
      html,
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
