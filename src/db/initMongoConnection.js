import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Contact } from '../models/contact.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString);
    console.log('✅ Mongo connection successfully established!');

    // Імпортуємо контакти, якщо колекція порожня
    const count = await Contact.countDocuments();
    if (count === 0) {
      const filePath = path.join(__dirname, '..', 'contacts.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const contacts = JSON.parse(data);
      await Contact.insertMany(contacts);
      console.log('📦 Контакти імпортовані з contacts.json');
    } else {
      console.log('📁 Контакти вже є в базі');
    }

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB or import contacts:', error.message);
    process.exit(1);
  }
};
