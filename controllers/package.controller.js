const response = require('../helpers/response');
const package = require('../models/package.module');
const validate = require('../validations/package.validate');

exports.add = async (req, res) => {
  try {
    const data = await validate.add.validateAsync(req.body);
    data.authData = req.authorization.data;
    try {
      const result = await package.add(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.update = async (req, res) => {
  try {
    const data = await validate.update.validateAsync(req.body);
    data.id = req.params.id;
    try {
      const result = await package.update(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.delete = async (req, res) => {
  try {
    data.authData = req.authorization.data;
    data.id = req.params.id;
    try {
      const result = await package.delete(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.getAll = async (req, res) => {
  try {
    try {
      const result = await package.getAll();
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.getByID = async (req, res) => {
  try {
    data.id = req.params.id;
    try {
      const result = await package.getByID(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.search = async (req, res) => {
  try {
    //const data = await validate.search.validateAsync(req.body);
    try {
      const result = await package.search(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};

exports.select = async (req, res) => {
  try {
    const data = req.body;
    try {
      const result = await package.select(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};
