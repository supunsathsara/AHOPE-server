const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency.controller');

router
  .route('/')
  .get(currencyController.getAllCurrencies)
  .post(currencyController.createNewCurrency);

router.route('/search').get(currencyController.searchCurrencies);

router.route('/select').get(currencyController.select);

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
  .get(currencyController.getCurrencyById)
  .post(currencyController.updateCurrencyById)
  .delete(currencyController.deleteCurrencyById);

module.exports = router;
