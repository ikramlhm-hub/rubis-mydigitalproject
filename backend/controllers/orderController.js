const db = require('../config/db');

// Créer une commande manuellement (ancienne version)
exports.createOrder = (req, res) => {
  const {
    id_utilisatrice,
    id_adresse,
    total_commande,
    mode_livraison,
    moyen_paiement,
    statut_paiement
  } = req.body;

  db.query(
    `INSERT INTO commande 
    (id_utilisatrice, total_commande, id_adresse, mode_livraison, moyen_paiement, statut_paiement)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [id_utilisatrice, total_commande, id_adresse, mode_livraison, moyen_paiement, statut_paiement],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Commande créée', id_commande: result.insertId });
    }
  );
};

// Voir toutes les commandes
exports.getAllOrders = (req, res) => {
  db.query('SELECT * FROM commande', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Voir une commande par ID
exports.getOrderById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM commande WHERE id_commande = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(results[0]);
  });
};

// Supprimer une commande
exports.deleteOrder = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM commande WHERE id_commande = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Commande supprimée' });
  });
};

// Créer une commande depuis un panier actif
exports.createOrderFromCart = (req, res) => {
  const userId = req.user.id; // récupéré via le token
  const {
    id_adresse,
    mode_livraison,
    moyen_paiement,
    statut_paiement
  } = req.body;

  // Étape 1 : récupérer le panier actif
  db.query(
    `SELECT * FROM panier WHERE id_utilisatrice = ? AND statut = "actif"`,
    [userId],
    (err, cartResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (cartResults.length === 0) return res.status(404).json({ error: 'Aucun panier actif trouvé.' });

      const cart = cartResults[0];

      // Étape 2 : récupérer les articles du panier
      db.query(
        `SELECT * FROM detail_panier WHERE id_panier = ?`,
        [cart.id_panier],
        (err, items) => {
          if (err) return res.status(500).json({ error: err.message });
          if (items.length === 0) return res.status(400).json({ error: 'Le panier est vide.' });

          const total = items.reduce((sum, item) => sum + item.sous_total, 0);

          // Étape 3 : créer la commande
          db.query(
            `INSERT INTO commande (id_utilisatrice, total_commande, id_adresse, mode_livraison, moyen_paiement, statut_paiement)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, total, id_adresse, mode_livraison, moyen_paiement, statut_paiement],
            (err, orderResult) => {
              if (err) return res.status(500).json({ error: err.message });

              const orderId = orderResult.insertId;

              // Étape 4 : enregistrer les détails de la commande
              const values = items.map(item => [
                orderId,
                item.id_produit,
                item.quantite,
                item.prix_unitaire,
                item.sous_total
              ]);

              db.query(
                `INSERT INTO detail_commande (id_commande, id_produit, quantite, prix_unitaire, sous_total)
                 VALUES ?`,
                [values],
                (err) => {
                  if (err) return res.status(500).json({ error: err.message });

                  // Étape 5 : vider le panier
                  db.query(`DELETE FROM detail_panier WHERE id_panier = ?`, [cart.id_panier], (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Étape 6 : marquer le panier comme "validé"
                    db.query(`UPDATE panier SET statut = "validé" WHERE id_panier = ?`, [cart.id_panier], (err) => {
                      if (err) return res.status(500).json({ error: err.message });
                      res.status(201).json({ message: 'Commande créée avec succès depuis le panier', id_commande: orderId });
                    });
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};
