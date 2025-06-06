const db = require('../config/db');

// Get all products
exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM produit', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get product by ID
exports.getProductById = (req, res) => {
  db.query('SELECT * FROM produit WHERE id_produit = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
};

// Create product
exports.createProduct = (req, res) => {
  const { nom, description, stock, photo, prix } = req.body;
  db.query(
    'INSERT INTO produit (nom, description, stock, photo, prix) VALUES (?, ?, ?, ?, ?)',
    [nom, description, stock, photo, prix],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Product created', id: result.insertId });
    }
  );
};

// Update product
exports.updateProduct = (req, res) => {
  const { nom, description, stock, photo, prix } = req.body;
  db.query(
    'UPDATE produit SET nom = ?, description = ?, stock = ?, photo = ?, prix = ? WHERE id_produit = ?',
    [nom, description, stock, photo, prix, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated' });
    }
  );
};

// Delete product
exports.deleteProduct = (req, res) => {
  db.query('DELETE FROM produit WHERE id_produit = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
};
