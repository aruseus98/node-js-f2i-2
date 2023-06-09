const express = require('express');
const router = express.Router();
const Validator = require('../utils/validator');

const productValidation = require('../middlewares/productValidation');
const productController = require('../controllers/productController');

router.post('/', productValidation.validateCardInfo(Validator.cardInfo), productController.createProduct);
router.put('/:id', productValidation.validateCardInfo(Validator.cardInfo), productController.updateProduct);
// On a pas besoin de valdier les données ici
router.get('/:id', productController.readProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
