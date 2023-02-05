const Joi = require('joi');

exports.createNewStateSchema = Joi.object({
  name: Joi.string().max(50).required(),
  country: Joi.number().required(),
  added_by: Joi.number().optional().default(null),
  status: Joi.string().valid(1, 0, 2).default(1).optional(),
});

exports.updateStateSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  country_id: Joi.number().optional(),
  status: Joi.string().valid(1, 0, 2).optional(),
});
