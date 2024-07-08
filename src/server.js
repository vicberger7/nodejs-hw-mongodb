import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundHandlerMiddleware.js';
import { UPLOAD_DIR } from './constants/index.js';
import cookieParser from 'cookie-parser';
import { swagger } from './middlewares/swagger.js';

export const setupServer = () => {
  const app = express();

  app.use('/api-docs', swagger());

  app.use(express.json());

  app.use(cookieParser());

  app.use(cors());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
