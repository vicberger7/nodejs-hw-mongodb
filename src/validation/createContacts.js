import Joi from 'joi';

export const createContactSchema = Joi.object({
  photoUrl: Joi.string(),
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required().min(3).max(20),
  isFavorite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .min(3)
    .max(20),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
});
