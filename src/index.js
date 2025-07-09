import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js'; 

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running! Check the /contacts endpoint and /auth endpoint for more information.',
    status: 200,
  });
});

app.use(router);

app.use(notFoundHandler);

app.use(errorHandler);

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

bootstrap();