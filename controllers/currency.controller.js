const Currency = require('../models/currency.module');

exports.getAllCurrencies = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Currency.findAll(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { currencies: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrencyById = async (req, res, next) => {
  try {
    const [rows, _] = await Currency.findById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { currency: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewCurrency = async (req, res, next) => {
  try {
    const currency = new Currency(req.body);
    const rows = await currency.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        currency: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCurrencyById = async (req, res, next) => {
  try {
    const [rows, _] = await Currency.updateById(req.params.id, req.body);
    res.status(200).json({
      status: true,
      code: 200,
      data: {
        currency: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCurrencyById = async (req, res, next) => {
  try {
    const [rows, _] = await Currency.deleteById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: {
        currency: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchCurrencies = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Currency.search(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { currencies: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.select = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Currency.select(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { currencies: rows },
    });
  } catch (err) {
    next(err);
  }
};
