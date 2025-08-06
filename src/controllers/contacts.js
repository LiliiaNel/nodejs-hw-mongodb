import mongoose from "mongoose";
import { createContact, updateContact, getAllContacts, getContactById, deleteContact, replaceContact } from "../services/contacts.js";
import createHttpError from 'http-errors';
import {parsePaginationParams} from '../utils/parsePaginationParams.js';
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

export const getContactsController = async (req, res) => {
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts(page, perPage, sortBy, sortOrder, filter, req.user.id);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const {contactId} = req.params;
  const contact = await getContactById(contactId, req.user.id);
  
 if (contact === null) {
   throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact({...req.body, userId: req.user.id});

  res.status(201).json({
    status: 201,
    message: `Successfully created contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(404, 'Contact not found'));
    return 
  };

  const contact = await deleteContact(contactId, req.user.id);

  if (contact === null) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { value, updatedExisting } = await replaceContact(contactId, req.body, req.user.id);

  if (!value) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = updatedExisting ? 201 : 200;
  const message = updatedExisting
    ? 'Contact created successfully!'
    : 'Contact updated successfully!';

  res.status(status).json({
    status,
    message,
    data: value,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(404, 'Contact not found'));
    return 
  };

  const result = await updateContact(contactId, req.body, req.user.id);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  };

  res.json({
    status: 200,
    message: `Successfully patched contact!`,
    data: result,
  });
}

