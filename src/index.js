import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

// Connect to MongoDB first
await initMongoConnection();

// Then start the server
setupServer();
