const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controllers');

const userController = require('../controllers/user.controllers');

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

module.exports = router;
