const mongoose = require('mongoose');

const TrendSchema = new mongoose.Schema({
  title: String,
  category: String,
  score: Number,
  source: String,
  url: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trend', TrendSchema);
