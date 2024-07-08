import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

import { saveFile } from '../utils/saveFile.js';

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

export const createContact = async ({ photo, ...payload }) => {
  const url = await saveFile(photo);

  const newContact = await Contact.create({
    ...payload,
    photoUrl: url,
  });

  return await newContact.save();
};

export const upsertContact = async (
  { _id: ID, userId },
  payload,
  options = {},
) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: ID, userId },
    payload,
    {
      new: true,

      ...options,
    },
  );
  return rawResult;
};

export const deleteContactById = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  return contact;
};
