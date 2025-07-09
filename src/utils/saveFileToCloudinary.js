import cloudinaryModule from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

/**
 * Завантажує файл на Cloudinary і повертає посилання
 * @param {Object} file - об'єкт файлу з multer (має властивість path)
 * @returns {Promise<string>} - secure_url з Cloudinary
 */
export const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    await fs.unlink(file.path); // видаляємо тимчасовий файл
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
