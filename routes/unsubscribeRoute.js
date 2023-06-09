const express = require('express')
const router = express.Router();

const unsubscribeController = require('../controllers/unsubscribeController');

// Route pour le désabonnement

router.put('/unsubscribe/:id', unsubscribeController.unsubscribeProduct)

module.exports = router;