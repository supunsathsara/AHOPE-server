const Country = require('../models/country.module');
const {
  createNewCountrySchema,
  updateCountrySchema,
} = require('../validations/country.validate');

exports.getAllCountries = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Country.findAll(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { countries: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCountryById = async (req, res, next) => {
  try {
    const data = req.params.id;
    const [rows, _] = await Country.findById(data);
    res.status(200).json({
      status: true,
      code: 200,
      data: { country: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewCountry = async (req, res, next) => {
  try {
    const { error, value: validatedData } = createNewCountrySchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const country = new Country(validatedData);
    const rows = await country.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        country: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCountryById = async (req, res, next) => {
  try {
    const { error, value: validatedData } = updateCountrySchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const [rows, _] = await Country.updateById(req.params.id, validatedData);
    res.status(200).json({
      status: true,
      code: 204,
      data: { country: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCountryById = async (req, res, next) => {
  try {
    await Country.deleteById(req.params.id);
    res.status(204).json({
      status: true,
      code: 204,
      message: 'Country deleted',
    });
  } catch (err) {
    next(err);
  }
};

exports.searchCountries = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Country.search(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { countries: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCountryList = async (req, res, next) => {
  try {
    const data = req.query;
    const rows = await Country.getCountryList(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { countries: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.select = async (req, res, next) => {
  try {
    const [rows, _] = await Country.select();
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { countries: rows },
    });
  } catch (err) {
    next(err);
  }
};
