const db = require('../config/db');

// Add a new address
exports.addAddress = (req, res) => {
  const { userId, street, city, postalCode, country } = req.body;

  console.log("Received body:", req.body); // DEBUG

  if (!userId || !street || !city || !postalCode || !country) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  db.query(
    `INSERT INTO adresse (id_utilisatrice, rue, ville, code_postal, pays)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, street, city, postalCode, country],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Adresse ajoutée', addressId: result.insertId });
    }
  );
};

// Get all addresses for a user
exports.getAddressesByUser = (req, res) => {
  const userId = req.params.userId;

  db.query(
    'SELECT * FROM adresse WHERE id_utilisatrice = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
