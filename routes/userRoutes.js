const express = require('express')
const router = express.Router();

const checkUserData = require('../middlewares/checkUserData');
const userController = require('../controllers/userController');

router.post('/middleware', checkUserData, userController.createUser)

// Route pour le désabonnement

router.post('/desabonnement', checkUserData, userController.createUser)

module.exports = router;