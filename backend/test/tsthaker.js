const fetchHackerNewsTrends = require('./hackernews');

(async () => {
  const results = await fetchHackerNewsTrends();
  console.log('Fetched Hacker News Trends:', results);
})();