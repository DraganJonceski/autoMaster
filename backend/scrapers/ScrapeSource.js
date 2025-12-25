const moongose = require('mongoose');

const ScrapeSourceSchema = new moongose.Schema({
    supplier: 
    { type: String,
     required: true,
    index: true
    },
    categoryName: String,
    url: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    lastScrapedAt: Date
});

module.exports = moongose.model('ScrapeSource', ScrapeSourceSchema);