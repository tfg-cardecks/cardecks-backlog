import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config";

const getTransporterConfig = (email: string) => {
  const domain = email.split('@')[1];
  switch (domain) {
    case 'gmail.com':
      return {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      };
    case 'hotmail.com':
    case 'outlook.com':
      return {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      };
    default:
      throw new Error('Unsupported email domain');
  }
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporterConfig = getTransporterConfig(EMAIL_USER);
  const transporter = nodemailer.createTransport(transporterConfig);

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};