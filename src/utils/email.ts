import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config";

export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(EMAIL_PASS, EMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
