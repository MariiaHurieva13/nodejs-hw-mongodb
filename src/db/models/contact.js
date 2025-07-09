import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      trim: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      lowercase: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    photo: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ContactsCollection = model('contacts', contactSchema);
