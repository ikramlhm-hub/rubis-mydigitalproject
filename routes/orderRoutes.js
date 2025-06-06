const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/auth');

router.post('/', orderController.createOrder); // version manuelle
router.post('/from-cart', authenticate, orderController.createOrderFromCart); 
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
