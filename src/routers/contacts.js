import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  // getContactsCreatedByUserController,
  createContactController,
  patchContactController,
  putContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { createContactSchema } from '../validation/createContacts.js';
import { updateContactSchema } from '../validation/updateContact.js';
import { upload } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use('/:contactId', validateMongoId('contactId'));

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.put(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(putContactController),
);

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
