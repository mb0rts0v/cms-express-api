
const express = require('express');
const router = express.Router();


const userController = require('../controllers/auth'); 
const validationMiddleware = require('../middleware/validation');

router.post('/signup', validationMiddleware.userRules, validationMiddleware.validate, userController.signup);
router.post('/login', validationMiddleware.userRules, validationMiddleware.validate, userController.login);


module.exports = router;