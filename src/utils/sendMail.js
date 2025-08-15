import nodemailer from 'nodemailer';
import 'dotenv/config';

import { SMTP } from '../constants/index.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariable(SMTP.SMTP_HOST),
  port: Number(getEnvVariable(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: getEnvVariable(SMTP.SMTP_USER),
    pass: getEnvVariable(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (mail) => {
  mail.from = 'liliiaszivak@gmail.com';
  return await transporter.sendMail(mail);
};