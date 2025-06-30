import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, uniqueString, userId) => {
    const transporter = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.AUTH_MAIL,
            pass:process.env.AUTH_PASS,
        }
    });

    const mailOptions = {
        from:process.env.AUTH_MAIL,
        to:email,
        subject:"Verify your email",
        html:`
            <p>Click the link below to verify your email:</p>
            <a href="http://localhost:3000/verify/${userId}/${uniqueString}">
            Verify Email
            </a>
        `
    };

    await transporter.sendMail(mailOptions)
}
