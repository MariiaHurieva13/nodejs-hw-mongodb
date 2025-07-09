import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-zА-Яа-яЁё\s-]+$/)
    .required()
    .messages({
      'string.empty': 'Имя обязательно',
      'string.min': 'Имя должно быть минимум 3 символа',
      'string.pattern.base': 'Имя может содержать только буквы, пробелы и дефисы',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Введите корректный email',
      'string.empty': 'Email обязателен',
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Пароль должен содержать минимум одну заглавную букву и одну цифру',
      'string.min': 'Пароль должен быть минимум 8 символов',
      'string.empty': 'Пароль обязателен',
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Введите корректный email',
      'string.empty': 'Email обязателен',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Пароль обязателен',
    }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Введите корректный email',
      'string.empty': 'Email обязателен',
    }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Пароль должен содержать минимум одну заглавную букву и одну цифру',
      'string.min': 'Пароль должен быть минимум 8 символов',
      'string.empty': 'Пароль обязателен',
    }),

  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Токен обязателен',
    }),
});
