import { ContactCollection } from "../models/contact.js";

export async function getAllContacts(page, perPage, sortBy, sortOrder, filter, userId) {
  const skip = page > 0 ? ( ( page - 1 ) * perPage ) : 0 ;

  const contactQuery =  ContactCollection.find({});

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactQuery.where("userId").equals(userId);

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

export async function getContactById(contactId, userId) {
  return ContactCollection.findOne({_id: contactId, userId});
};


export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactCollection.findOneAndDelete({
    _id: contactId, userId
  });

  return result;
};

export async function replaceContact(contactId, payload, userId) {
  const result = await ContactCollection.findOneAndUpdate( { _id: contactId, userId }, payload, {
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

export function updateContact(contactId, payload, userId) {
  return ContactCollection.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true });
}