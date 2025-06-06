const db = require('../config/db');

// Créer une inscription à une formule d’abonnement
exports.createSubscription = (req, res) => {
  const {
    id_utilisatrice,
    id_formule,
    date_debut,
    date_fin,
    moyen_paiement
  } = req.body;

  db.query(
    `INSERT INTO inscription_abonnement 
     (id_utilisatrice, id_formule, date_debut, date_fin, statut, moyen_paiement, niveau_actuel, date_dernier_niveau, points_accumules)
     VALUES (?, ?, ?, ?, 'actif', ?, 'Graine', NOW(), 0)`,
    [id_utilisatrice, id_formule, date_debut, date_fin, moyen_paiement],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Abonnement créé avec succès', id_inscription: result.insertId });
    }
  );
};

// Récupérer l’abonnement d’un utilisateur
exports.getUserSubscription = (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT ia.*, f.nom_formule, f.frequence, f.description, f.prix
     FROM inscription_abonnement ia
     JOIN formule_abonnement f ON ia.id_formule = f.id_formule
     WHERE ia.id_utilisatrice = ? AND ia.statut = 'actif'`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Aucun abonnement actif trouvé.' });
      res.json(results[0]);
    }
  );
};

// Résilier un abonnement
exports.cancelSubscription = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE inscription_abonnement SET statut = 'resilié', date_fin = NOW() WHERE id_inscription = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Abonnement résilié.' });
    }
  );
};

// Mettre à jour le niveau de fidélité (ex : Graine -> Plante)
exports.updateLevel = (req, res) => {
  const { id, nouveau_niveau, points } = req.body;

  db.query(
    `UPDATE inscription_abonnement 
     SET niveau_actuel = ?, date_dernier_niveau = NOW(), points_accumules = ? 
     WHERE id_inscription = ?`,
    [nouveau_niveau, points, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Niveau mis à jour.' });
    }
  );
};
