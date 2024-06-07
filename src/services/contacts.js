import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = 'id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const contactsFilter = Contact.find();

  if (filter.isFavorite) {
    contactsFilter.where('isFavorite').equals(filter.isFavorite);
  }

  const limit = perPage;
  const skip = perPage * (page - 1);

  const contactsQuery = Contact.find();
  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
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

export const upsertContact = async (ID, body, options = {}) => {
  console.log(body);
  const rawResult = await Contact.findByIdAndUpdate(ID, body, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  console.log(rawResult);

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
