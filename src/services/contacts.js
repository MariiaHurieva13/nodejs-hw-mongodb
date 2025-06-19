import { Contact } from '../models/contact.js';

export const contactService = {
  async getAllContacts() {
    try {
      const contacts = await Contact.find({});
      return {
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: { message: error.message }
      };
    }
  },

  async getContactById(contactId) {
    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        return {
          status: 404,
          message: 'Contact not found'
        };
      }
      return {
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: { message: error.message }
      };
    }
  }
};
