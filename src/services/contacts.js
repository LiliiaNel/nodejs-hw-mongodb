import { ContactCollection } from "../models/contact.js";

export async function getAllContacts(page, perPage, sortBy, sortOrder, filter) {
  const skip = page > 0 ? ( ( page - 1 ) * perPage ) : 0 ;

  const contactQuery =  ContactCollection.find({});

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalItems, currentPageContacts] = await Promise.all([ContactCollection.find({}).merge(contactQuery).countDocuments(),
   contactQuery.sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),]);

  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: currentPageContacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page>1,
    hasNextPage: totalPages>page,
  }
};

export async function getContactById(contactId) {
  return ContactCollection.findById(contactId);
};


export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const result = await ContactCollection.findOneAndDelete({
    _id: contactId,
  });

  return result;
};

export async function replaceContact(contactId, payload) {
  const result = await ContactCollection.findOneAndUpdate( { _id: contactId }, payload, {
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
  return ContactCollection.findByIdAndUpdate(contactId, payload, { new: true });
}