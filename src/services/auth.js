
import 'dotenv/config';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import jwt from 'jsonwebtoken';

import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/session.js';
import { createSession } from '../utils/createSession.js';
import { TEMPLATES_DIR, SMTP } from '../constants/index.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendEmail } from '../utils/sendMail.js';


// const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
//   path.resolve('src/templates/reset-password-reset.hbs'),
//   { encoding: 'utf-8' },
// );

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user!== null) throw createHttpError(409, 'Email in use');
  
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user=== null) {
    throw createHttpError(401, 'Unauthorized: incorrect email or password');
  }
  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (isMatch!== true) {
    throw createHttpError(401, 'Unauthorized: incorrect email or password');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();
  
  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });

};


export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};


export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401,'Refresh token is invalid');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  
  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};


export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found');
  };
  const resetToken = jwt.sign(
    {
      sub: user.id,
      email,
    },
    getEnvVariable('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
 
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.hbs',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVariable('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVariable(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};



export const requestPasswordReset = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVariable('JWT_SECRET'));
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new createHttpError(401, 'Token is expired or invalid.');
    }

 throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
  await SessionsCollection.deleteMany({ userId: user._id });
};

