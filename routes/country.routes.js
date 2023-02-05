const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');

router
  .route('/')
  .get(countryController.getAllCountries)
  .post(countryController.createNewCountry);

router.route('/list').get(countryController.getCountryList);

router.route('/search').get(countryController.searchCountries);

router.route('/select').get(countryController.select);

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
  .get(countryController.getCountryById)
  .post(countryController.updateCountryById)
  .delete(countryController.deleteCountryById);
module.exports = router;
