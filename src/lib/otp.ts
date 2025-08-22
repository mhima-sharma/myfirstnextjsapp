import nodemailer from "nodemailer";
import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTP = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "mahimasharma052002@gmail.com",
      pass: "dkuc jcvu fiid plbr",
    },
  });

  console.log("SMTP configuration loaded successfully");

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your OTP Code</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f5f0;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 550px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          padding: 35px 40px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          text-align: center;
          border: 1px solid #e8e4d9;
        }

        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        .logo {
          max-width: 130px;
          margin-bottom: 5px;
        }

        .brand-name {
          color: #9d7b46;
          font-size: 28px;
          font-weight: bold;
          margin-top: 10px;
        }

        h1 {
          color: #222;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #555;
          font-size: 16px;
          margin-bottom: 25px;
        }

        .otp-box {
          display: inline-block;
          background: linear-gradient(135deg, #9d7b46, #d4af37);
          color: #fff;
          padding: 20px 40px;
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 10px;
          border-radius: 14px;
          margin: 20px 0;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2), 0 0 15px #d4af37;
          transition: transform 0.3s ease-in-out;
          text-shadow: 0 0 6px #fff;
        }

        .otp-box:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 18px #d4af37;
        }

        .note {
          color: #666;
          font-size: 14px;
          margin-top: 15px;
        }

        .footer {
          margin-top: 25px;
          font-size: 13px;
          color: #777;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .footer a {
          color: #9d7b46;
          text-decoration: none;
          font-weight: bold;
        }

        @media screen and (max-width: 600px) {
          .container {
            padding: 25px 20px;
          }
          .otp-box {
            font-size: 28px;
            padding: 15px 25px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dyao79iwv/image/upload/v1755861553/logo_qci67c.png" alt="Luxeloom Logo" class="logo" />
        </div>
        <div class="brand-name">LuxeLoom</div>
        <h1>Email Verification</h1>
        <p class="subtitle">Your One-Time Password (OTP) for Luxeloom is:</p>
        <div class="otp-box">${otp}</div>
        <p class="note">⚠️ This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
        <div class="footer">
          Need help? <a href="https://res.cloudinary.com/dyao79iwv/image/upload/v1755861553/logo_qci67c.png">Contact Support</a> <br />
          &copy; ${new Date().getFullYear()} Luxeloom. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Luxeloom" <mahimasharma052002@gmail.com>`,
    to,
    subject: "Your Luxeloom OTP Code",
    html: htmlTemplate,
  });
};
