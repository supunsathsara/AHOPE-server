const Joi = require('joi');

exports.createNewTownSchema = Joi.object({
  name: Joi.string().max(50).required(),
  postal_code: Joi.string().max(10).required(),
  state: Joi.number().required(),
  country: Joi.number().required(),
  added_by: Joi.number().optional().default(null),
  status: Joi.string().valid(1, 0, 2).default(1).optional(),
});

exports.updateTownSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  postal_code: Joi.string().max(10).optional(),
  state: Joi.number().optional(),
  country: Joi.number().optional(),
  status: Joi.string().valid(1, 0, 2).optional(),
});
