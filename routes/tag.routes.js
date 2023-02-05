const express = require('express');
const controller = require('../controllers/tag.controller');
const router = express.Router();

router.get('/', controller.getAll);

router.post('/add', controller.add);

router.put('/update/:id', controller.update);

router.delete('/delete/:id', controller.delete);

router.get('/search', controller.search);

router.get('/select', controller.select);

module.exports = router;
