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
const testRoutes = require('./routes/testRoutes');
const errorHandler = require('./middlewares/errorHandler');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/utilisatrices', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-details', orderDetailsRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);

app.get('/', (req, res) => res.send('API Rhéa Drinks connectée'));

// ✅ Gestion des routes non trouvées (404)
app.use((req, res, next) => {
  const error = new Error(`Route introuvable : ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ✅ Middleware global d'erreur
app.use(errorHandler);

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL:', err.message);
  } else {
    console.log('✅ Connecté à MySQL');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
