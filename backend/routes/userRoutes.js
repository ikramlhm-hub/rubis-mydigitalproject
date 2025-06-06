const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');



// Authentification
router.post('/register', userController.register);
router.post('/login', userController.login);

// Utilisateur connecté
router.get('/me', authenticate, userController.getProfile);

// Administrateur
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

router.put('/newsletter/:id', authenticate, userController.updateNewsletter);


module.exports = router;

