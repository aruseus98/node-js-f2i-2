const express = require('express')
const router = express.Router();
const Validator = require('../utils/validator');

const validate = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.post('/register', validate.validateRegister(Validator.register), authController.AuthRegister)
router.post('/login', validate.validateLogin(Validator.login), authController.AuthLogin)

module.exports = router;