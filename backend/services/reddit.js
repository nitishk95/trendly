const axios = require('axios');

module.exports = async function fetchRedditTrends() {
  const response = await axios.get('https://www.reddit.com/r/popular.json');
  const posts = response.data.data.children;

 return posts.slice(0, 10).map(p => ({
  title: p.data.title,
  category: p.data.subreddit,
  score: p.data.ups,
  source: 'Reddit',
  url: `https://reddit.com${p.data.permalink}`,
  timestamp: new Date()
}));
};

