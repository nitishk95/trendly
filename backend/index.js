const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import models and routes
const Trend = require('./models/Trend');
const fetchRedditTrends = require('./services/reddit');
const fetchHackerNewsTrends = require('./services/hackernews');
const fetchDevToArticles = require('./services/devto');

// Routes
// GET /api/trends?source=Reddit&skip=0&limit=10
app.get('/api/trends', async (req, res) => {
  const source = req.query.source; // optional filter
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const filter = source ? { source } : {};

  try {
    const trends = await Trend.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});


app.post('/api/fetch-trends', async (req, res) => {
  try {
    const reddit = await fetchRedditTrends();
    const hackernews = await fetchHackerNewsTrends();
    const combined = [...reddit, ...hackernews];

    await Trend.insertMany(combined, { ordered: false });

    res.status(201).json({ message: 'Trends fetched and stored', count: combined.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch and store trends' });
  }
});


// ✅ POST: Fetch and store Dev.to articles
app.post('/api/fetch-devto-articles', async (req, res) => {
  const { page = 1, perPage = 10, tag = '' } = req.body;

  try {
    const articles = await fetchDevToArticles(page, perPage, tag);
    await Trend.insertMany(articles);
    res.status(201).json({ message: 'Dev.to articles fetched and stored', count: articles.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch and store Dev.to articles' });
  }
});

app.get('/api/devto-articles', async (req, res) => {
  const { page = 1, perPage = 10, tag = '' } = req.query;

  try {
    const articles = await fetchDevToArticles(page, perPage, tag);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dev.to articles' });
  }
}); 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

