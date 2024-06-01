import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  upsertContact,
} from '../services/contacts.js';

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
  const payload = req.body;
  const newContact = await createContact(payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created new contact',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const ID = req.params.contactId;
  const payload = req;
  const { contact } = await upsertContact(ID, payload);

  res.status(200).json({
    status: 200,
    message: `Successfully created contact`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const ID = req.params.contactId;
  const payload = req;
  const { contact, isNew } = await upsertContact(ID, payload, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully ${isNew ? 'created' : 'updated'} contact`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const ID = req.params.contactId;
  await deleteContactById(ID);

  res.status(204).send();
};
