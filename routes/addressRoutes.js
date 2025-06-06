const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.post('/', addressController.addAddress);
router.get('/:userId', addressController.getAddressesByUser); // optional

module.exports = router;
