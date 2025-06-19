import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  try {
    const { MONGODB_URI } = process.env;

    await mongoose.connect(MONGODB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
