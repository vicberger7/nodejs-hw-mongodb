import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { Contact } from './db/models/contact.js';

const bootstrap = async () => {
  await initMongoConnection();
  const contacts = await Contact.find({});
  console.log(contacts);
  setupServer();
};

bootstrap();
