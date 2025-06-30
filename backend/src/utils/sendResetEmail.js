// utils/sendResetPasswordEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.AUTH_MAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const resetLink = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "https://indi-post-collect-v2.vercel.app"
  }/forget-password/${resetToken}`;

  const mailOptions = {
    from: process.env.AUTH_MAIL,
    to: email,
    subject: "Reset Your IndiPostCollect Password",
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank" style="color: #c0392b;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
