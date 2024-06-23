import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 5,
  sortBy = 'id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const contactsFilter = { userId };

  const contactsQuery = Contact.find(contactsFilter);

  if (filter.isFavorite) {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  const limit = perPage;
  const skip = perPage * (page - 1);

  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await Contact.find(contactsFilter)
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

export const getContactById = async ({ _id, userId }) => {
  const contact = await Contact.findById({ _id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};

export const createContact = async (payload) => {
  const newContact = new Contact(payload);
  return await newContact.save();
};

export const upsertContact = async (
  { _id: ID, userId },
  body,
  options = {},
) => {
  console.log(body);
  const rawResult = await Contact.findByIdAndUpdate({ _id: ID, userId }, body, {
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

export const deleteContactById = async ({ _id, userId }) => {
  const contact = await Contact.findByIdAndDelete({ _id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};
