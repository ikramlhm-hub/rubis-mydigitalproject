const db = require('../config/db');

exports.createCart = (req, res) => {
  db.query(
    `INSERT INTO panier (statut) VALUES ('actif')`,
    [],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Cart created", cartId: result.insertId });
    }
  );
};


exports.addToCart = (req, res) => {
  console.log("REQ BODY addToCart:", req.body); // Log pour debug

  const { cartId, productId, quantity, unitPrice } = req.body; // CORRIGÉ ici !
  const subtotal = quantity * unitPrice;

  db.query(
    `INSERT INTO detail_panier (id_panier, id_produit, quantite, prix_unitaire, sous_total)
     VALUES (?, ?, ?, ?, ?)`,
    [cartId, productId, quantity, unitPrice, subtotal],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL:", err); // Log erreur SQL
        return res.status(500).json({ error: err.message });
      }
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
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
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
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
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
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Cart cleared' });
    }
  );
};

// Valider le panier (nécessite authentification, appelle cette route via POST /api/cart/validate)
exports.validateCart = (req, res) => {
  // Cette route doit être protégée par authenticate sur le routeur !
  const { cartId } = req.body;
  const userId = req.user.id; // récupéré via le middleware authenticate

  // 1. Vérifier que le panier existe et qu'il a des items
  db.query(
    `SELECT * FROM detail_panier WHERE id_panier = ?`,
    [cartId],
    (err, details) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
      if (details.length === 0) return res.status(400).json({ error: "Panier vide !" });

      // 2. Créer la commande dans la table commande
      db.query(
        `INSERT INTO commande (id_utilisatrice, id_panier, date_commande, statut)
         VALUES (?, ?, NOW(), "en_attente")`,
        [userId, cartId],
        (err, result) => {
          if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ message: "Commande créée !", orderId: result.insertId });
        }
      );
    }
  );
};
