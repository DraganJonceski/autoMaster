const ScrapeSource = require('./ScrapeSource');
const Product = require('../models/Product');
const scrapeDelmakCategory = require('../scrapers/delmakScraper');

async function runDelmakScraper() {
  const sources = await ScrapeSource.find({
    supplier: 'Delmak',
    active: true
  });

  let totalInserted = 0;

  for (const source of sources) {
    console.log(`Scraping: ${source.categoryName}`);

    const scrapedProducts = await scrapeDelmakCategory(source.url);

    for (const p of scrapedProducts) {
      await Product.updateOne(
  { supplier: 'Delmak', productUrl: p.productUrl },
  {
    $set: {
      ...p,
      supplier: 'Delmak',
      lastUpdated: new Date()
    },
    $push: {
      priceHistory: {
        price: p.price,
        date: new Date()
      }
    }
  },
  { upsert: true }
);

    }

    source.lastScrapedAt = new Date();
    await source.save();

    totalInserted += scrapedProducts.length;
  }

  return totalInserted;
}

module.exports = { runDelmakScraper };
