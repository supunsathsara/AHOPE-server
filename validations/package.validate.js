const joi = require('joi');
/**
 * [
        data.name,
        data.subservice,
        data.marked_price,
        data.selling_price,
        data.status,
        dateTime,
        data.authData.user,
      ]
 */

exports.add = joi.object({
  name: joi.string().required().min(1).max(45).label('package name'),
  subservice: joi.number().required().label('package subservice'),
  marked_price: joi.number().required().label('package marked price'),
  selling_price: joi.number().required().label('package selling price'),
  status: Joi.string().valid(1, 0, 2).optional().label('package status'),
  created_by: joi.number().required().label('package created by'),
});

exports.update = joi.object({
  name: joi.string().min(1).max(45).label('package name'),
  subservice: joi.number().label('package subservice'),
  marked_price: joi.number().label('package marked price'),
  selling_price: joi.number().label('package selling price'),
  status: Joi.string().valid(1, 0, 2).optional().label('package status'),
  updated_by: joi.number().label('package name'),
});

exports.search = joi.object({
  search: joi.string().allow('').label('Search value'),
});
