const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);


module.exports = router;
