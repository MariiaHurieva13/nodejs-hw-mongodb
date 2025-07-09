import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const photoUrl = req.file?.path || null;
    const payload = {
      ...req.body,
      userId: req.user._id,
      ...(photoUrl && { photo: photoUrl }),
    };

    const contact = await createContact(payload);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(createHttpError(500, err.message || 'Error creating contact'));
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (err) {
    next(createHttpError(500, err.message || 'Error deleting contact'));
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photoUrl = req.file?.path || null;
    const payload = {
      ...req.body,
      ...(photoUrl && { photo: photoUrl }),
    };

    const result = await updateContact(contactId, userId, payload, {
      upsert: true,
    });

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(createHttpError(500, err.message || 'Error upserting contact'));
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photoUrl = req.file?.path || null;

    const payload = {
      ...req.body,
      ...(photoUrl && { photo: photoUrl }),
    };

    const result = await updateContact(contactId, userId, payload);

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(createHttpError(500, err.message || 'Unexpected error during patch'));
  }
};
