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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { ENV_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';

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

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const { body, file } = req;

  const newContactData = { ...body, photo: file, userId };
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

  const body = req.body;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env(ENV_VARS.IS_CLOUDINARY_ENABLED) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await upsertContact(
    { _id: ID, userId },
    { ...body, photoUrl },
  );

  if (!result) {
    return res.status(404).json({ status: 404, message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched contact`,
    data: result,
  });
};

export const putContactController = async (req, res) => {
  const userId = req.user._id;
  const ID = req.params.contactId;
  const { body, file } = req.body;

  const { contact, isNew } = await upsertContact(
    { _id: ID, userId },
    { ...body, photo: file },
    {
      upsert: true,
    },
  );

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
