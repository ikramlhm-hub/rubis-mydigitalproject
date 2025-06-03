const db = require('../config/db');

// Ajouter un témoignage
exports.addTestimonial = (req, res) => {
  const { id_utilisatrice, id_produit, id_commande, texte, notation } = req.body;

  if (!id_utilisatrice || !id_produit || !id_commande || !texte || !notation) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (notation < 1 || notation > 5) {
    return res.status(400).json({ error: 'La notation doit être entre 1 et 5.' });
  }

  db.query(
    `INSERT INTO temoignage (id_utilisatrice, id_produit, id_commande, texte, notation)
     VALUES (?, ?, ?, ?, ?)`,
    [id_utilisatrice, id_produit, id_commande, texte, notation],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Témoignage ajouté avec succès', id_temoignage: result.insertId });
    }
  );
};

// Récupérer les témoignages pour un produit
exports.getTestimonialsByProduct = (req, res) => {
  const productId = req.params.id;

  db.query(
    `SELECT t.*, u.prenom, u.nom 
     FROM temoignage t
     JOIN utilisatrice u ON t.id_utilisatrice = u.id_utilisatrice
     WHERE t.id_produit = ? 
     ORDER BY t.date_temoignage DESC`,
    [productId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Récupérer les témoignages d'une utilisatrice
exports.getTestimonialsByUser = (req, res) => {
  const userId = req.params.id;

  db.query(
    `SELECT t.*, p.nom AS nom_produit 
     FROM temoignage t
     JOIN produit p ON t.id_produit = p.id_produit
     WHERE t.id_utilisatrice = ?
     ORDER BY t.date_temoignage DESC`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Supprimer un témoignage
exports.deleteTestimonial = (req, res) => {
  const testimonialId = req.params.id;

  db.query(
    'DELETE FROM temoignage WHERE id_temoignage = ?',
    [testimonialId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Témoignage supprimé.' });
    }
  );
};
