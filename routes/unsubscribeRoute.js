const express = require('express')
const router = express.Router();

const unsubscribeController = require('../controllers/unsubscribeController');
const Validator = require('../utils/validator');
const editSubscription = require('../controllers/editSubscriptionController') 


// Route pour le désabonnement

router.put('/unsubscribe/:id', unsubscribeController.unsubscribeProduct)

// Route pour la modification d'abonnement

router.post('/editsubscription/:id', editSubscription.updateSubscription)

module.exports = router;