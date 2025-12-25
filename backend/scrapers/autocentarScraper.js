
const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

const BASE_URL = 'https://www.autocentar.mk';

async function scrapeAutocentar(listUrl) {
  try {
    console.log('SCRAPER CALLED with URL:', listUrl);

    const { data: html } = await axios.get(listUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(html);
    const products = [];

    $('div.item_list div.item_details').each((_, el) => {
      const card = $(el);

      // Link
      const linkEl = card.find('div.item_image a').first();
      let href = linkEl.attr('href') || '';

      if (href && !href.startsWith('http')) {
       href = `${BASE_URL}/${href.replace(/^\/+/, '')}`;
      }

      // Name/title
      const name = card.find('div.item_info h3.ptcat.name').text().trim();

      // Discounted price
      const priceText = card.find('span.price_discounted').text().trim();
      const numeric = priceText.replace(/[^\d,\\.]/g, '').replace(',', '.');
      const price = numeric ? Number(numeric) : null;

      if (!name || !price || !href) return;

      products.push({
        partName: name,
        partNumber: null,
        price,
        supplier: 'Autocentar',
        productUrl: href,
        affiliateUrl: href,
        availability: 'Unknown',
        description: '',
      });
    });

    await Product.deleteMany({ supplier: 'Autocentar' });
    const inserted = await Product.insertMany(products);
    console.log(`Scraped ${inserted.length} Autocentar products from list page`);

    return inserted;

  } catch (err) {
    console.error('Autocentar scrape error object:', err);
    console.error('Autocentar scrape error message:', err.message);
    throw err;
  }
}

module.exports = scrapeAutocentar;
