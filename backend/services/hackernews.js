const axios = require('axios');

module.exports = async function fetchHackerNewsTrends() {
  try {
    const topIds = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!Array.isArray(topIds.data) || topIds.data.length === 0) {
      console.error('No top stories received from Hacker News');
      return [];
    }
    const top10 = topIds.data.slice(0,10);
    // console.log('Top 10 Hacker News IDs:', top10);

    const items = await Promise.all(top10.map(async id => {
      try {
        const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        // console.log(story.data);
        return {
          title: story.data.title,
          category: 'Tech',
          score: story.data.score,
          source: 'HackerNews',
          url: story.data.url || `https://news.ycombinator.com/item?id=${id}`
        };
      } catch (err) {
        console.error(`Error fetching story ${id}:`, err.message);
        return null;
      }
    }));

    // Filter out any nulls from failed fetches
    return items.filter(Boolean);
  } catch (err) {
    console.error('Error fetching top stories:', err.message);
    return [];
  }
};