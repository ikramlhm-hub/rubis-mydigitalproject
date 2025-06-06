const express = require('express');
const router = express.Router();
const orderDetailsController = require('../controllers/orderDetailsController');

// Get all order details
router.get('/', orderDetailsController.getAllOrderDetails);

// Get order details by order ID
router.get('/:id', orderDetailsController.getDetailsByOrderId);

// Add 
router.post('/', orderDetailsController.addOrderDetail);

// Delete
router.delete('/:id', orderDetailsController.deleteOrderDetail);

module.exports = router;
