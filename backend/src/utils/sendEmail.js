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

export const sendVerificationEmail = async (email, uniqueString, userId) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl}/verify/${userId}/${uniqueString}`;

  const html = buildEmailHtml({
    title: "Verify your email address",
    preheader: "Confirm your email to activate your IndiPostCollect account.",
    greeting: "Hello,",
    bodyParagraphs: [
      "Thanks for signing up for IndiPostCollect. Please verify your email address to activate your account and start exploring:",
    ],
    ctaButton: {
      text: "Verify Email",
      url: verificationLink,
      color: "#111827",
    },
    infoText: "This verification link will expire in 6 hours. If you did not create an account on IndiPostCollect, you can safely ignore this email.",
    fallbackUrl: verificationLink,
    footerNote: "Marketplace for Philatelists & Postal Heritage",
  });

  const text = `Welcome to IndiPostCollect!\n\n` +
    `Thank you for joining India's premier marketplace for philately and postal heritage.\n\n` +
    `Please confirm your email address by opening the following link:\n` +
    `${verificationLink}\n\n` +
    `Note: This link will expire in 6 hours.\n` +
    `If you did not sign up for an IndiPostCollect account, you can safely ignore this email.`;

  const mailOptions = {
    from: `"IndiPostCollect" <${process.env.AUTH_MAIL}>`,
    to: email,
    subject: "Verify your email address — IndiPostCollect",
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email via nodemailer:", error);
    throw error;
  }
};

