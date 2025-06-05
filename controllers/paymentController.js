const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = require('../config/db');

exports.createCheckoutSession = async (req, res) => {
  const { products, id_utilisatrice, id_adresse } = req.body;

  if (!products || !Array.isArray(products) || !id_utilisatrice || !id_adresse) {
    return res.status(400).json({ error: 'Produits, ID utilisatrice et adresse requis.' });
  }

  try {
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    //  Étape 1 : créer une commande dans la BDD avec statut "en_attente"
    const now = new Date();
    db.query(
      `INSERT INTO commande (id_utilisatrice, id_adresse, date_commande, total_commande, statut_paiement, moyen_paiement)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_utilisatrice, id_adresse, now, totalAmount, 'en_attente', 'Stripe'],
      async (err, result) => {
        if (err) {
          console.error('Erreur création commande :', err);
          return res.status(500).json({ error: 'Erreur lors de l’enregistrement de la commande.' });
        }

        const id_commande = result.insertId;

        // Étape 2 : créer la session Stripe
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `http://localhost:3000/success?id_commande=${id_commande}`,
          cancel_url: 'http://localhost:3000/cancel',
          metadata: {
            id_utilisatrice: id_utilisatrice.toString(),
            id_commande: id_commande.toString(),
            montant: totalAmount.toString()
          }
        });

        console.log('Session Stripe créée et commande enregistrée, ID commande :', id_commande);
        res.json({ url: session.url });
      }
    );
  } catch (error) {
    console.error('Erreur Stripe :', error);
    res.status(500).json({ error: 'Erreur création session paiement' });
  }
};

// fonction
exports.confirmPayment = (req, res) => {
  const { id_commande } = req.body;

  if (!id_commande) {
    return res.status(400).json({ error: "ID commande requis." });
  }

  db.query(
    'UPDATE commande SET statut_paiement = "payé" WHERE id_commande = ?',
    [id_commande],
    (err, result) => {
      if (err) {
        console.error("Erreur confirmation paiement :", err);
        return res.status(500).json({ error: "Erreur lors de la confirmation du paiement." });
      }

      res.json({ message: "Paiement confirmé avec succès." });
    }
  );
};
