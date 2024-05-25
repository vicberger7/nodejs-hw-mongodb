import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully get all contacts',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    console.log(req.params);
    const ID = req.params.contactId;
    const contact = await getContactById(ID);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with ID ${ID} not found`,
      });
    }

    res.json({
      status: 200,
      data: contact,
      message: `Successfully get contact with ID ${ID}`,
    });
  });

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
