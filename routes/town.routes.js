const express = require('express');
const router = express.Router();
const townController = require('../controllers/town.controller');

router
  .route('/')
  .get(townController.getAllTowns)
  .post(townController.createNewTown);

router.route('/search').get(townController.searchTowns);

router.route('/select').get(townController.select);

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
  .get(townController.getTownById)
  .post(townController.updateTownById)
  .delete(townController.deleteTownById);

module.exports = router;
