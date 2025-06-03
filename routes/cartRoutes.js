const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/create', cartController.createCart); // Créer panier si non existant
router.post('/add', cartController.addToCart);     // Ajouter un produit au panier
router.get('/:id', cartController.getCartById);    // Voir le contenu du panier
router.delete('/item/:detailId', cartController.removeItem); // Supprimer un item
router.delete('/clear/:cartId', cartController.clearCart);   // Vider le panier

module.exports = router;
