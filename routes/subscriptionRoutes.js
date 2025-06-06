const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middlewares/auth'); // pour protéger certaines routes

// Créer un abonnement
router.post('/', authenticate, subscriptionController.createSubscription);

// Voir l’abonnement actif d’un utilisateur
router.get('/:userId', authenticate, subscriptionController.getUserSubscription);

// Résilier un abonnement
router.put('/cancel/:id', authenticate, subscriptionController.cancelSubscription);

// Mettre à jour le niveau (Graine → Plante → Fleur)
router.put('/update-level', authenticate, subscriptionController.updateLevel);

module.exports = router;
