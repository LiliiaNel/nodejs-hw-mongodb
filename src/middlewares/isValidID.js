import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export default function isValidID(req, res, next) {
  if (isValidObjectId(req.params.contactId) !== true) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
}