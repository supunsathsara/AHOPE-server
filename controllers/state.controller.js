const State = require('../models/state.module');
const {
  createNewStateSchema,
  updateStateSchema,
} = require('../validations/state.validate');

exports.getAllStates = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await State.findAll(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { states: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStateById = async (req, res, next) => {
  try {
    const data = req.params.id;
    const [rows, _] = await State.findById(data);
    res.status(200).json({
      status: true,
      code: 200,
      data: { state: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewState = async (req, res, next) => {
  try {
    const { error, value: validatedData } = createNewStateSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const state = new State(validatedData);
    const rows = await state.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        state: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStateById = async (req, res, next) => {
  try {
    const { error, value: validatedData } = updateStateSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const [rows, _] = await State.updateById(req.params.id, validatedData);
    res.status(200).json({
      status: true,
      code: 200,
      data: { state: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStateById = async (req, res, next) => {
  try {
    const [rows, _] = await State.deleteById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { state: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchStates = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await State.search(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { states: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.select = async (req, res, next) => {
  try {
    const [rows, _] = await State.select();
    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { states: rows },
    });
  } catch (err) {
    next(err);
  }
};
