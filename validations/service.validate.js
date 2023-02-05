const joi = require('joi');
/**data.name,
        data.short_desc,
        data.long_desc,
        data.status,
        dateTime,
        data.authData.user,
        data.slug,
        data.icon,
        data.main_image, */
exports.add = joi.object({
  name: joi.string().required().min(1).max(45).label('service name'),
  short_desc: joi
    .string()
    .required()
    .min(1)
    .max(45)
    .label('service short description'),
  long_desc: joi
    .string()
    .required()
    .min(1)
    .max(300)
    .label('service long description'),
  status: Joi.string().valid(1, 0, 2).optional().label('service status'),
  created_by: joi.number().required().label('service created by'),
  slug: joi.string().required().min(1).max(45).label('service slug'),
});

exports.update = joi.object({
  name: joi.string().min(1).max(45).label('service name'),
  short_desc: joi.string().min(1).max(45).label('service short description'),
  long_desc: joi.string().min(1).max(300).label('service long description'),
  status: Joi.string().valid(1, 0, 2).optional().label('service status'),
  updated_by: joi.number().label('service name'),
  slug: joi.string().min(1).max(45).label('service slug'),
});

exports.search = joi.object({
  search: joi.string().allow('').label('Search value'),
});
