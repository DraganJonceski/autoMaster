// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  partName: String,
  partNumber: String,
  price: Number,

  priceHistory: [
    {
      price: Number,
      date: Date
    }
  ],

  supplier: String,
  productUrl: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
