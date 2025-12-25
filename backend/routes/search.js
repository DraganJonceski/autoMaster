// routes/search.js
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    const filter = query
      ? { partName: { $regex: query, $options: 'i' } }
      : {};

    const products = await Product.find(filter).limit(50);

    res.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (err) {
    console.error('SEARCH ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
