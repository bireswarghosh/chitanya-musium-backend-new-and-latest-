const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com',
  'https://sri-chaitanya-mahaprabhu-museum-ent.vercel.app',
  'http://localhost:3001',
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

// Flutter app uses /api/v1 prefix - alias for backward compatibility
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/museum', require('./routes/museum'));
app.use('/api/v1/razorpay', require('./routes/razorpay'));
app.use('/api/v1/camping', require('./routes/camping'));
app.use('/api/v1/booking', require('./routes/booking'));
app.use('/api/v1/permissions', require('./routes/permissions'));
app.use('/api/v1/activity', require('./routes/activity'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Museum API is running on port ' + PORT });
});

// Debug DB check - temporary for diagnosis (remove after fix)
app.get('/api/debug/db', async (req, res) => {
  try {
    const db = require('./config/database');
    const [rows] = await db.execute('SELECT 1 as ok');
    res.json({ 
      status: 'DB OK', 
      ok: rows[0].ok,
      env: {
        host: process.env.DB_HOST ? 'SET (' + process.env.DB_HOST + ')' : 'MISSING',
        user: process.env.DB_USER || 'MISSING',
        database: process.env.DB_NAME || 'MISSING',
        hasPassword: !!process.env.DB_PASSWORD,
        port: PORT
      }
    });
  } catch (e) {
    res.status(500).json({ 
      status: 'DB FAILED', 
      error: e.message || e.sqlMessage || 'unknown',
      code: e.code,
      errno: e.errno,
      sqlMessage: e.sqlMessage,
      env: {
        host: process.env.DB_HOST || 'MISSING',
        user: process.env.DB_USER || 'MISSING',
        database: process.env.DB_NAME || 'MISSING',
        hasPassword: !!process.env.DB_PASSWORD
      }
    });
  }
});

// For Vercel: Vercel imports app via require(), so only listen when run directly (node server.js) for local dev.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Museum API Server running on port ${PORT}`);
  });
}





// app.listen(PORT, () => {
//   console.log(`🔥 Museum API Server running on port ${PORT}`);
// });



module.exports = app;



