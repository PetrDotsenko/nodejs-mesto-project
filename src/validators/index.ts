import { Joi, Segments } from 'celebrate';

const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

export const signupValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(urlRegex).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const signinValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const cardCreateValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegex).required(),
  }),
};

export const userIdParamValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};

export const cardIdParamValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};

export const profileUpdateValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};

export const avatarUpdateValidation = {
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
};
