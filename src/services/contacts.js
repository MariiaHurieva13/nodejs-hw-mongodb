import { Contact } from '../models/contact.js';

export const contactService = {
  async getAllContacts() {
    const contacts = await Contact.find({});
    return {
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts
    };
  },

  async getContactById(contactId) {
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
  }
};
