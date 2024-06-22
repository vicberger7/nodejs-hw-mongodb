import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  upsertContact,
} from '../services/contacts.js';
import { isHttpError } from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilters } from '../utils/parseFilters.js';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilters(req.query);

  filter.userId = userId;

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully get all contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  try {
    const userId = req.user._id;
    const ID = req.params.contactId;

    const contact = await getContactById({ _id: ID, userId });

    if (!contact) {
      return res
        .status(404)
        .json({ status: 404, message: 'Contact not found' });
    }

    res.json({
      status: 200,
      message: `Successfully get contact with id ${ID}`,
      data: contact,
    });
  } catch (error) {
    res
      .status(404)
      .json({ status: error.status, message: 'Contact not found' });
  }
};

//

export const createContactController = async (req, res) => {
  const userId = req.user._id;

  const newContactData = { ...req.body, userId };
  const newContact = await createContact(newContactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created new contact',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;
  const ID = req.params.contactId;

  const contact = await upsertContact({ _id: ID, userId }, req.body);

  if (!contact) {
    return res.status(404).json({ status: 404, message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully created contact`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const userId = req.user._id;
  const ID = req.params.contactId;
  const body = req.body;

  const { contact, isNew } = await upsertContact({ _id: ID, userId }, body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully ${isNew ? 'created' : 'updated'} contact`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.contactId;

  const contact = await getContactById({ _id: id, userId });

  if (!contact) {
    next(isHttpError(404, 'Not found'));
    return;
  }

  await deleteContactById(id);

  res.status(204).send();
};
