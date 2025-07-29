
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.number().integer().min(6).max(16).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal").required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.number().integer().min(6).max(16),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal"),
});