const joi = require('joi');
/**
 * [
        data.name,
        data.service,
        data.short_desc,
        data.long_desc,
        data.status,
        dateTime,
        data.authData.user,
        data.slug,
        data.main_image,
      ]
 */

exports.add = joi.object({
  name: joi.string().required().min(1).max(45).label('subservice name'),
  service: joi.number().required().label('subservice service'),
  short_desc: joi
    .string()
    .required()
    .min(1)
    .max(45)
    .label('subservice short description'),
  long_desc: joi

    .string()
    .required()
    .min(1)
    .max(300)
    .label('subservice long description'),
  status: Joi.string().valid(1, 0, 2).optional().label('subservice status'),
  created_by: joi.number().required().label('subservice created by'),
  slug: joi.string().required().min(1).max(45).label('subservice slug'),
});

exports.update = joi.object({
  name: joi.string().min(1).max(45).label('subservice name'),
  service: joi.number().label('subservice service'),
  short_desc: joi.string().min(1).max(45).label('subservice short description'),
  long_desc: joi.string().min(1).max(300).label('subservice long description'),
  status: Joi.string().valid(1, 0, 2).optional().label('subservice status'),
  updated_by: joi.number().label('subservice name'),
  slug: joi.string().min(1).max(45).label('subservice slug'),
});

exports.search = joi.object({
  search: joi.string().allow('').label('Search value'),
});
