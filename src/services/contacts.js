import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (ID) => {
  const contact = await Contact.findById(ID);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};

export const createContact = async (payload) => {
  const newContact = new Contact(payload);
  return await newContact.save();
};

export const upsertContact = async (ID, payload, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(ID, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (ID) => {
  await Contact.findByIdAndDelete(ID);
};
