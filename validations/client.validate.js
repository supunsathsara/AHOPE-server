const Joi = require('joi');

exports.createNewClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  status: Joi.string().valid(1, 0, 2).default('1').optional(),
  mobile: Joi.string().allow('').optional(),
  birthdate: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),
  address: Joi.object({
    town: Joi.number().required(),
    state: Joi.number().required(),
    country: Joi.number().required(),
  }).required(),
  reqBy: Joi.number().allow('').optional(),
});

exports.updateClientSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid(1, 0, 2).optional(),
  mobile: Joi.string().allow('').optional(),
  birthdate: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),
  town: Joi.number().allow('').optional(),
  state: Joi.number().allow('').optional(),
  country: Joi.number().allow('').optional(),
  reqBy: Joi.number().allow('').optional(),
});
