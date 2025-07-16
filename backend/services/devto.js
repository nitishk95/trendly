// services/devto.js
const axios = require('axios');

module.exports = async function fetchDevToArticles(page = 1, perPage = 10, tag = '') {
  try {
    const url = `https://dev.to/api/articles?per_page=${perPage}&page=${page}${tag ? `&tag=${tag}` : ''}`;
    const { data } = await axios.get(url);
    // console.log(data);
    return data.map(article => ({
      title: article.title,
      description: article.description,
      category: article.tags?.split(',')[0] || 'Dev',
      score: article.public_reactions_count || 0,
      source: 'DevTo',
      url: article.url,
      cover_image: article.cover_image || `https://picsum.photos/seed/${article.title.length}/400/200`,
      social_image: article.social_image || `https://picsum.photos/seed/${article.title.length}/400/200`,  
    }));
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error.message);
    return [];
  }
};
