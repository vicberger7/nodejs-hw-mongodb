import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  putContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactController),
);

contactsRouter.put('/contacts/:contactId', ctrlWrapper(putContactController));

contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
