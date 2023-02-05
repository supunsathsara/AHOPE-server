const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

router
  .route('/')
  .get(clientController.getAllClients)
  .post(clientController.createNewClient);

router.route('/search').get(clientController.searchClient);

router.route('/select').get(clientController.select);

module.exports = router;
