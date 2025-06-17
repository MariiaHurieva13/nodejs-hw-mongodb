import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { contactController } from './controllers/contacts.js';

export const setupServer = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Routes
  app.get('/contacts', contactController.getAllContacts);
  app.get('/contacts/:contactId', contactController.getContactById);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
