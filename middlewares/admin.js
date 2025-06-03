// middlewares/admin.js

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // autorisé
  } else {
    res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
};

module.exports = isAdmin;
