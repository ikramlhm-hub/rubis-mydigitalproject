const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on stocke les infos décodées dans req.user
    next(); // on continue vers le contrôleur
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = authenticate;
