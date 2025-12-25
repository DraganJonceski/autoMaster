const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

const BASE_URL = 'https://alvadi.mk';

async function scrapeAlvadiCategory(listUrl) {
  try {
    const { data: html } = await axios.get(listUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const $ = cheerio.load(html);
    const products = [];

    $('div.cpd-article').each((_, el) => {
      const card = $(el);

      // title + link
      const titleLink = card.find('h3 a').first();
      const name = titleLink.text().trim();
      let href = titleLink.attr('href') || '';

      if (href && !href.startsWith('http')) {
        href = `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
      }

      // item code (шифра на производ)
      const itemId = card.find('span').first().text().trim();

      // price on list
      let price = null;
      let priceText = card.find('strong.price, span.price').first().text().trim();

      if (priceText) {
        const numeric = priceText.replace(/[^\d,\\.]/g, '').replace(',', '.');
        price = numeric ? Number(numeric) : null;
      }

      if (!name || !href) return;

      products.push({
        partName: name,
        partNumber: itemId || null,
        price: price || 0,
        supplier: 'Alvadi',
        productUrl: href,
        affiliateUrl: href,
        availability: 'Unknown',
        description: '',
      });
    });

    console.log(`Alvadi found ${products.length} products before saving`);
    await Product.deleteMany({ supplier: 'Alvadi' });
    const inserted = await Product.insertMany(products);
    console.log(`Scraped ${inserted.length} Alvadi products`);

    return inserted;

  } catch (err) {
    console.error('Alvadi scrape error:', err.message);
    throw err;
  }
}

module.exports = scrapeAlvadiCategory;
