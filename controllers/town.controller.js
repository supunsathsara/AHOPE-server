const Town = require('../models/town.module');
const {
  createNewTownSchema,
  updateTownSchema,
} = require('../validations/town.validate');

exports.getAllTowns = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Town.findAll(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { towns: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTownById = async (req, res, next) => {
  try {
    const [rows, _] = await Town.findById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { town: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewTown = async (req, res, next) => {
  try {
    const { error, value: validatedData } = createNewTownSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const town = new Town(validatedData);
    const rows = await town.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        town: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTownById = async (req, res, next) => {
  try {
    const { error, value: validatedData } = updateTownSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const [rows, _] = await Town.updateById(req.params.id, validatedData);
    res.status(200).json({
      status: true,
      code: 200,
      data: { town: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTownById = async (req, res, next) => {
  try {
    const [rows, _] = await Town.deleteById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { town: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchTowns = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await Town.search(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { towns: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.select = async (req, res, next) => {
  try {
    const [rows, _] = await Town.select();
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { towns: rows },
    });
  } catch (err) {
    next(err);
  }
};
