const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendNewsletterConfirmation } = require('../services/newsletter');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requis.' });

  // Vérifier si déjà inscrit
  db.query('SELECT * FROM newsletter WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur base de données', details: err.message });

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email déjà inscrit à la newsletter.' });
    }

    // Inscription
    db.query('INSERT INTO newsletter (email) VALUES (?)', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur enregistrement', details: err.message });

      try {
        await sendNewsletterConfirmation(email);
        res.status(201).json({ message: 'Inscription réussie et email envoyé !' });
      } catch (mailErr) {
        res.status(201).json({ message: 'Inscription réussie, mais envoi du mail échoué.', error: mailErr.message });
      }
    });
  });
});

module.exports = router;
