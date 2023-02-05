const express = require('express');
const controller = require('../controllers/service.controller');
const router = express.Router();

router.get('/', controller.getAll);
router.post('/add', controller.add);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

module.exports = router;
