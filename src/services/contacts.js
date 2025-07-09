import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  if (!payload.name || !payload.contactType) {
    throw new Error('Missing required fields: name and contactType');
  }

  const safePayload = {
    ...payload,
    isFavourite:
      typeof payload.isFavourite === 'boolean'
        ? payload.isFavourite
        : payload.isFavourite === 'true',
    photo:
      typeof payload.photo === 'string' || payload.photo === null
        ? payload.photo
        : payload.photo?.path || null,
  };

  return await ContactsCollection.create(safePayload);
};

export const deleteContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const safePayload = {
    ...payload,
    isFavourite:
      typeof payload.isFavourite === 'boolean'
        ? payload.isFavourite
        : payload.isFavourite === 'true',
    photo:
      typeof payload.photo === 'string' || payload.photo === null
        ? payload.photo
        : payload.photo?.path || null,
  };

  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    safePayload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
