const express = require('express'); // PAS 'router'
const router = express.Router();

router.get('/test-error', (req, res, next) => {
  const error = new Error('Erreur volontaire pour test');
  error.statusCode = 400;
  next(error);
});

module.exports = router;
