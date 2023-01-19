const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

// Get all users and create a user
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router.route('/login').post(userController.loginUser);

// Get user by id
router.param('id', (req, res, next, id) => {
  const regex = /^[0-9]+$/;
  if (!regex.test(id)) {
    return res.status(400).json({
      code: 400,
      error: 'Invalid operation',
    });
  }
  next();
});

router
  .route('/:id')
  .get(userController.getUserById)
  .post(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
