import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(subject:string, html:string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    html,
  });

  // console.log("Email sent:", info.messageId);
}

export async function replyEmail(subject:string, html:string, to:string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Harsha from JAYMELOLAB" <${process.env.EMAIL_USER}>`,
    to: to || process.env.EMAIL_TO,
    subject,
    html,
  });

  // console.log(`✅ Email sent to ${to || process.env.EMAIL_TO}:`, info.messageId);
}
