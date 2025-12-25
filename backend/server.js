// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const searchRoutes = require('./routes/search');
const trackingRoutes = require('./routes/tracking');

const { runDelmakScraper } = require('./scrapers/delmakScraper');
const scrapeAlvadiCategory = require('./scrapers/alvadiScraper');

dotenv.config();

global.mongoConnected = false;

const app = express();

/* =========================
   Admin middleware
========================= */
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== process.env.admin_token) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}


/* =========================
   CORS
========================= */
const allowedOrigins = new Set([
  'https://auto-frontend-virid.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin (server‑to‑server, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.error('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  })
);



app.use(express.json());

/* =========================
   MongoDB
========================= */
mongoose
  .connect(process.env.MONGO_URI, {
    // optional but good defaults
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');
    global.mongoConnected = true;
  })
  .catch(err => {
    console.error('MongoDB error:', err.message);
    console.error('MongoDB full error:', err);
    global.mongoConnected = false;
  });

/* =========================
   Public routes
========================= */
app.use('/api', searchRoutes);
app.use('/api/tracking', trackingRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: !!global.mongoConnected
  });
});

/* =========================
   Admin routes
========================= */

// Trigger Delmak scrape (manual or cron)
app.get(
  '/api/admin/scrape-delmak-now',
  adminAuth,
  async (req, res) => {
    try {
      console.log('[ADMIN] Delmak scrape triggered');
      const inserted = await runDelmakScraper();

      res.json({
        success: true,
        supplier: 'Delmak',
        scraped: inserted || 0
      });
    } catch (error) {
      console.error('Delmak scrape error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Trigger Alvadi scrape (headless)
app.get(
  '/api/admin/scrape-alvadi',
  adminAuth,
  async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res
          .status(400)
          .json({ success: false, error: 'Missing url parameter' });
      }

      const scrapedCount = await scrapeAlvadiCategory(url);

      res.json({
        success: true,
        supplier: 'Alvadi',
        scraped: scrapedCount
      });
    } catch (error) {
      console.error('Alvadi scrape error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

app.get('/api/debug-env', (req, res) => {
  res.json({
    mongoUri: process.env.MONGO_URI || null
  });
});





/* =========================
   Export for Vercel
========================= */
// Only listen locally; Vercel handles it
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
  });
}


module.exports = app;
