const db = require('../config/db');

// Get all order details
exports.getAllOrderDetails = (req, res) => {
  db.query('SELECT * FROM detail_commande', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get details by order ID
exports.getDetailsByOrderId = (req, res) => {
  const orderId = req.params.id;
  db.query('SELECT * FROM detail_commande WHERE id_commande = ?', [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add detail to an order
exports.addOrderDetail = (req, res) => {
  const { id_commande, id_produit, quantite, prix_unitaire } = req.body;
  const sous_total = quantite * prix_unitaire;

  db.query(
    'INSERT INTO detail_commande (id_commande, id_produit, quantite, prix_unitaire, sous_total) VALUES (?, ?, ?, ?, ?)',
    [id_commande, id_produit, quantite, prix_unitaire, sous_total],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Order detail added', id: result.insertId });
    }
  );
};

// Delete a detail
exports.deleteOrderDetail = (req, res) => {
  db.query('DELETE FROM detail_commande WHERE id_detail = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order detail deleted' });
  });
};
