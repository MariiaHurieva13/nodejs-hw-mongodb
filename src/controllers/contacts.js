import { contactService } from '../services/contacts.js';

export const contactController = {
  async getAllContacts(req, res) {
    const result = await contactService.getAllContacts();
    res.status(result.status).json(result);
  },

  async getContactById(req, res) {
    const { contactId } = req.params;
    const result = await contactService.getContactById(contactId);
    res.status(result.status).json(result);
  }
};
