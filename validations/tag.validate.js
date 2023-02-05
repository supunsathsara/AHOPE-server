const joi = require('joi');

/**
 * [data.name,
 * data.status,
 * dateTime,
 * data.authData.user]
 */

exports.add = joi.object({
  name: joi.string().required().min(1).max(45).label('tag name'),
  status: Joi.string().valid(1, 0, 2).optional().label('tag status'),
  created_by: joi.number().required().label('tag created by'),
});

exports.update = joi.object({
  name: joi.string().min(1).max(45).label('tag name'),
  status: Joi.string().valid(1, 0, 2).optional().label('tag status'),
  updated_by: joi.number().label('tag name'),
});
