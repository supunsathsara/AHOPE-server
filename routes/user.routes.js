const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get all users and create a user
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router.route('/login').post(userController.loginUser);

//router.route('/logout').post(userController.logoutUser);

router.route('/search').get(userController.searchUser);

router.route('/select').get(userController.select);

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
