
import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal").required(),
   parentId: Joi.string().custom((value, helper) => {
		    if (value && !isValidObjectId(value)) {
		      return helper.message('Parent id should be a valid mongo id');
		    }
		    return true;
		 }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("home", "work", "personal"),
   parentId: Joi.string().custom((value, helper) => {
		    if (value && !isValidObjectId(value)) {
		      return helper.message('Parent id should be a valid mongo id');
		    }
		    return true;
		 }),
}); 