const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendNewsletterConfirmation } = require('../services/newsletter');

// =========================
// 1. Inscription utilisateur
// =========================
exports.register = async (req, res) => {
  const { prenom, nom, email, mot_de_passe } = req.body;

  if (!prenom || !nom || !email || !mot_de_passe) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    db.query('SELECT * FROM utilisatrice WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(409).json({ error: 'Email déjà utilisé.' });

      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      db.query(
        'INSERT INTO utilisatrice (prenom, nom, email, mot_de_passe, inscrit_newsletter) VALUES (?, ?, ?, ?, ?)',
        [prenom, nom, email, hashedPassword, 'oui'],
        async (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          try {
            await sendNewsletterConfirmation(email, prenom);
            console.log(`Email de bienvenue envoyé à ${email}`);
          } catch (error) {
            console.error(' Erreur lors de l’envoi de l’e-mail de confirmation :', error.message);
          }

          res.status(201).json({ message: 'Compte créé avec succès.', id: result.insertId });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
};

// =========================
// 2. Connexion
// =========================
exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  db.query('SELECT * FROM utilisatrice WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Email invalide.' });

    const user = results[0];
    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect.' });

    const token = jwt.sign(
      { id: user.id_utilisatrice, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id_utilisatrice,
        email: user.email,
        role: user.role,
      },
    });
  });
};

// =========================
// 3. Profil utilisateur connecté
// =========================
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM utilisatrice WHERE id_utilisatrice = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

// =========================
// 4. Admin : voir tous les utilisateurs
// =========================
exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM utilisatrice', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// =========================
// 5. Admin : supprimer un utilisateur
// =========================
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM utilisatrice WHERE id_utilisatrice = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Utilisateur supprimé.' });
  });
};

// =========================
// 6. Newsletter : activer / désactiver
// =========================
exports.updateNewsletter = (req, res) => {
  const id = req.params.id;
  const { inscrit } = req.body;

  if (!['oui', 'non'].includes(inscrit)) {
    return res.status(400).json({ error: 'Valeur invalide pour inscrit_newsletter.' });
  }

  db.query(
    'UPDATE utilisatrice SET inscrit_newsletter = ? WHERE id_utilisatrice = ?',
    [inscrit, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      if (inscrit === 'oui') {
        db.query(
          'SELECT email, prenom FROM utilisatrice WHERE id_utilisatrice = ?',
          [id],
          (err, results) => {
            if (!err && results.length > 0) {
              const { email, prenom } = results[0];
              sendNewsletterConfirmation(email, prenom)
                .then(() => console.log(`Email de bienvenue envoyé à ${email}`))
                .catch((err) => console.error(' Erreur d’envoi de mail :', err));
            }
          }
        );
      }

      res.json({ message: `Newsletter ${inscrit === 'oui' ? 'activée' : 'désactivée'} avec succès.` });
    }
  );
};
