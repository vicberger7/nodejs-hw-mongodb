import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  upsertContact,
} from '../services/contacts.js';
import { HttpError } from '../middlewares/errorHandlerMiddleware.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully get all contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const ID = req.params.contactId;
  const contact = await getContactById(ID);

  res.json({
    status: 200,
    message: `Successfully get contact with id ${ID}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created new contact',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const ID = req.params.contactId;
  const { contact } = await upsertContact(ID, req.body);

  res.status(200).json({
    status: 200,
    message: `Successfully created contact`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const ID = req.params.contactId;
  const body = req.body;
  const { contact, isNew } = await upsertContact(ID, body, {
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
  const id = req.params.contactId;

  const contact = await getContactById(id);

  if (!contact) {
    next(HttpError(404, 'not found'));
    return;
  }

  await deleteContactById(id);



  res.status(204).send();
};
