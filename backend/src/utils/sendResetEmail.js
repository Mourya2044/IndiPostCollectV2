// utils/sendResetPasswordEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { buildEmailHtml } from "./emailTemplate.js";
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.AUTH_MAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/forget-password/${resetToken}`;

  const html = buildEmailHtml({
    title: "Reset your password",
    preheader: "Reset instructions for your IndiPostCollect account.",
    greeting: "Hello,",
    bodyParagraphs: [
      "We received a request to reset the password for your IndiPostCollect account.",
      "Click the button below to choose a new password:"
    ],
    ctaButton: {
      text: "Reset Password",
      url: resetLink,
      color: "#111827",
    },
    infoText: "This link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email — your account remains secure.",
    fallbackUrl: resetLink,
    footerNote: "Marketplace for Philatelists & Postal Heritage",
  });

  const text = `Hello Philatelist,\n\n` +
    `We received a request to reset the password for your IndiPostCollect account.\n\n` +
    `Click the link below to choose a new password:\n` +
    `${resetLink}\n\n` +
    `Note: This link will expire in 15 minutes.\n` +
    `If you did not request this password reset, please ignore this email. Your password will not change.`;

  const mailOptions = {
    from: `"IndiPostCollect" <${process.env.AUTH_MAIL}>`,
    to: email,
    subject: "Reset Your Password — IndiPostCollect",
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset email via nodemailer:", error);
    throw error;
  }
};

