const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com',
  'https://sri-chaitanya-mahaprabhu-museum-ent.vercel.app',
  'https://your-backend-name.vercel.app',
  'https://2gvbh86w-3001.inc1.devtunnels.ms/',
  'https://chaitanyafront-ta8d.vercel.app',
  "https://chaitanyamuseum.vercel.app"
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    if (isLocalDev || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/museum', require('./routes/museum'));
app.use('/api/razorpay', require('./routes/razorpay'));
app.use('/api/camping', require('./routes/camping'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/activity', require('./routes/activity'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Museum API is running on port ' + PORT });
});

// For Vercel deployment
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`Museum API Server running on port ${PORT}`);
//   });
// }

app.listen(PORT, () => {
  console.log(`🔥 Museum API Server running on port ${PORT}`);
});

module.exports = app;



