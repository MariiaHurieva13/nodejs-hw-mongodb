import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
import express from 'express';

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
