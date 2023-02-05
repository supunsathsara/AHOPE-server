const Client = require('../models/client.module');
const {
  createNewClientSchema,
  updateClientSchema,
} = require('../validations/client.validate');
const { hashPassword, comparePass } = require('../helper/password.helper');

exports.createNewClient = async (req, res, next) => {
  try {
    const { error, value: validatedData } = createNewClientSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    let { password } = validatedData;
    password = await hashPassword(password);
    validatedData.password = password;
    const client = new Client(validatedData);
    const rows = await client.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        client: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const data = req.query;
    const rows = await Client.findAll(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows?.length || 0,
      data: { clients: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const [rows, _] = await Client.findById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { client: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateClientById = async (req, res, next) => {
  try {
    // const { error, value: validatedData } = updateClientSchema.validate(
    //   req.body
    // );
    // if (error) {
    //   return res.status(400).json({
    //     status: false,
    //     message: error.message,
    //   });
    // }
    const [rows, _] = await Client.updateById(req.params.id, validatedData);
    res.status(200).json({
      status: true,
      code: 200,
      data: { client: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchClient = async (req, res, next) => {
  try {
    const data = req.query;
    const [rows, _] = await User.search(data);
    res.status(200).json({
      status: true,
      code: 200,
      results: rows?.length || 0,
      data: { users: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.select = async (req, res, next) => {
  try {
    const [rows, _] = await Client.select();
    res.status(200).json({
      status: true,
      code: 200,
      results: rows?.length || 0,
      data: { users: rows },
    });
  } catch (err) {
    next(err);
  }
};
