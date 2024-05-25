import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    required: true,
    default: 'personal',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    timestamps: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    timestamps: true,
  },
});

export const Contact = model('contact', contactSchema);
