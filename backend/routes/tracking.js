const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// POST /api/tracking/click
router.post('/click', async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      redirectUrl: product.affiliateUrl || product.productUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
