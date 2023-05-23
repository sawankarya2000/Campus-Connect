const express = require('express');

const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/:id', fileController.getFile);

module.exports = router;
