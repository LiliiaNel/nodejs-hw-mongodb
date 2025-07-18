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

export const updateContact = async (contactId, payload, options = {}) => { 
const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}