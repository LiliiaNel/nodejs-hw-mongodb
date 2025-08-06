import createHttpError from 'http-errors';

import { SessionsCollection } from '../models/session.js';
import { UsersCollection } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (typeof authHeader !== 'string') {
    next(createHttpError(401, 'Please provide access token'));
    return;
  }
  
  const [bearer, accessToken] = authHeader.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken });

  if (session === null) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);

  if (user === null) {
    next(createHttpError(401));
    return;
  }

  req.user = { id: user._id, name: user.name };

  next();
};