const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/auth'); // AJOUTE CETTE LIGNE !!!


router.post('/create', cartController.createCart);
router.post('/add', cartController.addToCart);
router.get('/:id', cartController.getCartById);
router.delete('/item/:detailId', cartController.removeItem);
router.delete('/clear/:cartId', cartController.clearCart);

// SEULE cette route doit avoir authenticate :
router.post('/validate', authenticate, cartController.validateCart);

module.exports = router;
