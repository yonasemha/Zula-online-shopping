const express = require('express');

const errorController = require('../controllers/error');

const router = express.Router();

router.get('/403', errorController.get403);

module.exports = router;