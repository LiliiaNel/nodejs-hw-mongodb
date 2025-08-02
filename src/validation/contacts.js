
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal").required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal"),
});