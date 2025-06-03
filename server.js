const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderDetailsRoutes = require('./routes/orderDetailsRoutes');
const addressRoutes = require('./routes/addressRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const paymentRoutes = require('./routes/paymentRoutes');









dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/utilisatrices', userRoutes); //utilisateur
app.use('/api/products', productRoutes); //produits
app.use('/api/cart', cartRoutes); //panier
app.use('/api/orders', orderRoutes); //commandes
app.use('/api/order-details', orderDetailsRoutes); //detail commandes
app.use('/api/addresses', addressRoutes); //adresses
app.use('/api/newsletter', newsletterRoutes); //newsletter
app.use('/api/subscriptions', subscriptionRoutes); //Abonnement Rhéa
app.use('/api/testimonials', testimonialRoutes); //Avis Rhéa
app.use('/api/payment', paymentRoutes); //paiement






app.get('/', (req, res) => res.send('API Rhéa Drinks connectée'));

db.connect((err) => {
  if (err) {
    console.error(' Erreur de connexion à MySQL:', err.message);
  } else {
    console.log('Connecté à MySQL');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
