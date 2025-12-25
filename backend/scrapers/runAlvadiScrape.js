// runAlvadiScrape.js
const axios = require('axios');
require('dotenv').config();

// Local backend when testing
const API_BASE = process.env.SCRAPER_API_BASE || 'http://localhost:5000';

// Same admin token your server.js checks
const ADMIN_TOKEN = process.env.admin_token;

// Example Alvadi URL (replace with any product / category URL you support)
const ALVADI_URL =
  'https://alvadi.mk/spare-parts/jeep/4000-2003/disk-za-sopirachki-1690/804371-jeep-bjc-jeep-4000-4-0-all-wheel-drive-143kw-petrol-suv-2003-2007-petrol';

async function run() {
  if (!ADMIN_TOKEN) {
    console.error('Missing admin_token in .env');
    process.exit(1);
  }

  try {
    console.log('Triggering Alvadi scrape...');
    const res = await axios.get(`${API_BASE}/api/admin/scrape-alvadi`, {
      params: { url: ALVADI_URL },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    console.log('Alvadi scrape response:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

run();
