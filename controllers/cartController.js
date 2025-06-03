const db = require('../config/db');

// Créer un panier (si aucun actif n'existe pour l'utilisateur)
exports.createCart = (req, res) => {
  const { userId } = req.body;

  db.query(
    'SELECT * FROM panier WHERE id_utilisatrice = ? AND statut = "actif"',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(200).json({ message: 'Cart already exists', cart: results[0] });
      }

      db.query(
        'INSERT INTO panier (id_utilisatrice) VALUES (?)',
        [userId],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Cart created', cartId: result.insertId });
        }
      );
    }
  );
};

// Ajouter un produit dans le panier
exports.addToCart = (req, res) => {
  const { cartId, productId, quantity, unitPrice } = req.body;
  const subtotal = quantity * unitPrice;

  db.query(
    `INSERT INTO detail_panier (id_panier, id_produit, quantite, prix_unitaire, sous_total)
     VALUES (?, ?, ?, ?, ?)`,
    [cartId, productId, quantity, unitPrice, subtotal],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Product added to cart', detailId: result.insertId });
    }
  );
};

// Récupérer le contenu d’un panier
exports.getCartById = (req, res) => {
  const cartId = req.params.id;

  db.query(
    `SELECT dp.*, p.nom, p.photo FROM detail_panier dp
     JOIN produit p ON dp.id_produit = p.id_produit
     WHERE dp.id_panier = ?`,
    [cartId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    }
  );
};

// Supprimer un article du panier
exports.removeItem = (req, res) => {
  const detailId = req.params.detailId;

  db.query(
    'DELETE FROM detail_panier WHERE id_detail = ?',
    [detailId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item removed from cart' });
    }
  );
};

// Vider entièrement un panier
exports.clearCart = (req, res) => {
  const cartId = req.params.cartId;

  db.query(
    'DELETE FROM detail_panier WHERE id_panier = ?',
    [cartId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cart cleared' });
    }
  );
};
