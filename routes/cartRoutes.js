const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/auth');


router.post('/create', authenticate, cartController.createCart); // Créer panier SI utilisateur connecté
router.post('/add', authenticate, cartController.addToCart);     // Ajouter un produit (toujours protégé)
router.get('/:id', authenticate, cartController.getCartById);    // Voir le panier (protégé)
router.delete('/item/:detailId', authenticate, cartController.removeItem); // Supprimer un item (protégé)
router.delete('/clear/:cartId', authenticate, cartController.clearCart);   // Vider le panier (protégé)

router.post('/validate', authenticate, cartController.validateCart); //route protegée == redirige vers la page de connexion


module.exports = router;
