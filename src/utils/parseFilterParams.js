import { CONTACT_TYPES } from '../constants/index.js';

const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) =>
    [CONTACT_TYPES.WORK, CONTACT_TYPES.HOME, CONTACT_TYPES.PERSONAL].includes(
      type,
    );

  if (isType(type)) return type;
};

const parseBoolean = (value) => {
  if (typeof value === 'string') {
    const lowerCasedValue = value.toLowerCase();
    if (lowerCasedValue === 'true') return true;
    if (lowerCasedValue === 'false') return false;
  }
  if (typeof value === 'boolean') return value;

  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};