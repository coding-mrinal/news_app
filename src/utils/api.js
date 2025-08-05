import axios from "axios";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

/**
 * Fetch top headlines for a given country (default: US) and category (optional).
 * @param {string} country - ISO country code (e.g., 'us', 'gb').
 * @param {string} category - News category (e.g., 'business', 'sports', 'technology').
 * @returns {Promise<Object>} Response from NewsAPI
 */
export async function fetchTopHeadlines(country = "us", category = "") {
  let url = `${BASE_URL}/top-headlines?country=${country}`;
  if (category) {
    url += `&category=${category}`;
  }
  url += `&apiKey=${API_KEY}`;

  const response = await axios.get(url);
  return response.data;
}

/**
 * Search for news articles by keyword.
 * @param {string} query - Search query
 * @returns {Promise<Object>} Response from NewsAPI
 */
export async function fetchNewsByQuery(query) {
  const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}