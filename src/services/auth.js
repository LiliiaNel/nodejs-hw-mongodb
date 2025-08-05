
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/session.js';
import { createSession } from '../utils/createSession.js';


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