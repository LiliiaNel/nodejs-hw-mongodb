import { Contact } from "../models/contactSchema.js";

export async function getAllContacts(page, perPage) {
  const skip = page > 0 ? ( ( page - 1 ) * perPage ) : 0 ;

  const [total, contacts] = await Promise.all([Contact.countDocuments(),
   Contact.find({}).skip(skip).limit(perPage),]);

  const totalPages = Math.ceil(total / perPage);
  return {
    contacts,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages>page,
    hasPreviousPage: page>1,
  }
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