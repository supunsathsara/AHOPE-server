const express = require('express');
const router = express.Router();
const stateController = require('../controllers/state.controller');

router
  .route('/')
  .get(stateController.getAllStates)
  .post(stateController.createNewState);

router.route('/search').get(stateController.searchStates);

router.route('/select').get(stateController.select);

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
  .get(stateController.getStateById)
  .post(stateController.updateStateById)
  .delete(stateController.deleteStateById);

module.exports = router;
