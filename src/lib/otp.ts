import nodemailer from "nodemailer";
import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTP = async (to: string, otp: string) => {
  // Static SMTP config
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP (example)
    port: 587,
    secure: false,
    auth: {
      user: "mahimasharma052002@gmail.com", // your static email
      pass: "dkuc jcvu fiid plbr",          // your static app password (NOT your Gmail login password)
    },
  });

  console.log("Static SMTP configuration loaded successfully");

  await transporter.sendMail({
    from: `"MyFirstNextApp" <mahimasharma052002@gmail.com>`, // static sender email
    to,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  });
};
