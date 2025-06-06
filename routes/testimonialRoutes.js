const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const authenticate = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');

// Ajouter un témoignage
router.post('/', authenticate, testimonialController.addTestimonial);

// Voir les témoignages pour un produit
router.get('/product/:id', testimonialController.getTestimonialsByProduct);

// Voir les témoignages d’un utilisateur
router.get('/user/:id', authenticate, testimonialController.getTestimonialsByUser);

// Supprimer un témoignage (admin uniquement)
router.delete('/:id', authenticate, isAdmin, testimonialController.deleteTestimonial);

module.exports = router;
