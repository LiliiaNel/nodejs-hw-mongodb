import { Contact } from "../models/contactSchema.js";

export async function getAllContacts() {
  return Contact.find({});
};

export async function getContactById(contactId) {
  return Contact.findById(contactId);
};


export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const result = await Contact.findOneAndDelete({
    _id: contactId,
  });

  return result;
};

export async function replaceContact(contactId, payload) {
  const result = await Contact.findOneAndUpdate( { _id: contactId }, payload, {
    new: true,
    upsert: true,
    overwrite: true,
    includeResultMetadata: true,
    runValidators: true,
  });

  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}

export function updateContact(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true });
}