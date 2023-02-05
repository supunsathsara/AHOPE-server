const response = require('../helpers/response');
const service = require('../models/service.module');
const validate = require('../validations/service.validate');

exports.add = async (req, res) => {
  try {
    const data = await validate.add.validateAsync(req.body);
    data.authData = req.authorization.data;
    try {
      const result = await service.add(data);
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
      const result = await service.update(data);
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
    const data = await validate.delete.validateAsync(req.body);
    data.authData = req.authorization.data;
    data.id = req.params.id;
    try {
      const result = await service.delete(data);
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
    data = data.authData = req.authorization.data;
    try {
      const result = await service.getAll(data);
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
    data.authData = req.authorization.data;
    data.id = req.params.id;
    try {
      const result = await service.getByID(data);
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
    const data = await validate.search.validateAsync(req.body);
    try {
      const result = await service.search(data);
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
      const result = await service.select(data);
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send(response.error('0500'));
    }
  } catch (err) {
    res.status(200).send(response.error('0000', err.details[0].message));
  }
};
