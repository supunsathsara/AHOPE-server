const db = require('../config/db');
const User = require('../models/user.module');
const { hashPassword, comparePass } = require('../helper/password.helper');
const {
  userUpdateSchema,
  createUserSchema,
  loginSchema,
} = require('../validations/user.validate');

exports.getAllUsers = async (req, res, next) => {
  try {
    //const [rows] = await db.execute('select * from user;');
    const [rows, _] = await User.findAll();

    res.status(200).json({
      status: true,
      code: 200,
      results: rows.length,
      data: { users: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewUser = async (req, res, next) => {
  try {
    const { error, value: validatedData } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    let { name, email, password, status } = validatedData;
    password = await hashPassword(password);
    data = { name, email, password, status };
    console.log(data.status);
    const user = new User(data);
    const rows = await user.save();
    res.status(201).json({
      status: true,
      code: 201,
      data: {
        user: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const [rows, _] = await User.findById(req.params.id);
    res.status(200).json({
      status: true,
      code: 200,
      data: { user: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    const [rows, _] = await User.updateById(req.params.id, req.body);
    res.status(204).json({
      status: true,
      code: 204,
      data: {
        user: rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const stat = await User.deleteById(req.params.id);
    res.status(204).json({
      status: true,
      code: 204,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: error.message,
      });
    }
    const { email, password } = req.body;
    const [rows, _] = await User.findByAuth(email);
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ status: false, code: 404, message: 'Invalid Email' });
    }
    const user = rows[0];
    const isMatch = await comparePass(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        code: 401,
        message: 'Invalid credentials',
      });
    }
    res.status(200).json({
      status: true,
      code: 200,
      message: 'Login Success',
    });
  } catch (err) {
    next(err);
  }
};
