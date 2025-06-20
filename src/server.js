import express from 'express';
import pinoHttp from 'pino-http';
import pino from 'pino';
import cors from 'cors';
import { contactService } from './services/contacts.js';

const PORT = Number(process.env.PORT || 3000);

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pinoHttp({ logger }));

  app.get('/', (req, res, next) => {
    try {
      res.json({
        message: 'Server is running! Check the /contacts endpoint',
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await contactService.getAllContacts();
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await contactService.getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ status: 404, message: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  });

  // Обработчик 404 — после всех роутов
  app.use( (req, res) => {
    res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  });
  
  app.use((error, req, res, next) => {
    req.log.error(error); // pino-http логирует ошибку
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
