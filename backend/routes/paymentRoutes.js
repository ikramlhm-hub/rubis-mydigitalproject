// /routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Crée une session Stripe et enregistre la commande (MCD respecté)
router.post('/create-checkout-session', paymentController.createCheckoutSession);

// Met à jour la commande en statut "payé" après succès
router.post('/confirm', paymentController.confirmPayment);

module.exports = router;
