const db = require('../config/db');
const { sendNewsletterConfirmation } = require('../services/newsletter');

exports.subscribe = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis.' });
  }

  // Vérifier si l’email est déjà inscrit
  db.query('SELECT * FROM newsletter WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email déjà inscrit.' });
    }

    // Insérer l’email dans la table newsletter
    db.query('INSERT INTO newsletter (email) VALUES (?)', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      try {
        await sendNewsletterConfirmation(email);
        res.status(201).json({ message: 'Inscription réussie. Email envoyé.' });
      } catch (e) {
        res.status(201).json({ message: 'Inscription réussie, mais erreur lors de l’envoi de l’email.' });
      }
    });
  });
};
