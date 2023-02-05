const Joi = require('joi');

exports.createNewCountrySchema = Joi.object({
  code: Joi.string().max(10).required(),
  name: Joi.string().max(50).required(),
  time_zone: Joi.string().max(45).required(),
  currency: Joi.string().max(45).required(),
  currency_symbol: Joi.string().max(10).required(),
  added_by: Joi.number().optional().default(null),
  status: Joi.string().valid(1, 0, 2).default(1).optional(),
});

exports.updateCountrySchema = Joi.object({
  code: Joi.string().max(10).optional(),
  name: Joi.string().max(50).optional(),
  time_zone: Joi.string().max(45).optional(),
  currency: Joi.string().max(45).optional(),
  currency_symbol: Joi.string().max(10).optional(),
  status: Joi.string().valid(1, 0, 2).optional(),
});
