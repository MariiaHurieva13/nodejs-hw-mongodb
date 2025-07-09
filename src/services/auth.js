import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  JWT_SECRET,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    userId: newUser._id,
    email: newUser.email,
    name: newUser.name,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const session = createSession(user._id);
  return await SessionsCollection.create(session);
};

const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });

  const newSession = createSession(session.userId);
  return await SessionsCollection.create(newSession);
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    { sub: user._id, email },
    getEnvVar(JWT_SECRET),
    { expiresIn: '15m' }
  );

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const html = handlebars.compile(templateSource)({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async ({ token, password }) => {
  let payload;

  try {
    payload = jwt.verify(token, getEnvVar(JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err instanceof Error ? err.message : 'Invalid token');
  }

  const user = await UsersCollection.findOne({
    _id: payload.sub,
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne({ _id: user._id }, { password: encryptedPassword });
};
