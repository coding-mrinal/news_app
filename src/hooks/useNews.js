import { useState, useCallback } from "react";
import { fetchTopHeadlines, fetchNewsByQuery } from "../utils/api";

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async (queryOrCategory = "") => {
    setLoading(true);
    setError(null);

    try {
      let data;
      // Check if the query is a category (business, sports, etc.) or a search term
      const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];

      if (categories.includes(queryOrCategory)) {
        // It's a category - fetch headlines with this category
        data = await fetchTopHeadlines("us", queryOrCategory);
      } else if (queryOrCategory) {
        // It's a search query
        data = await fetchNewsByQuery(queryOrCategory);
      } else {
        // No query/category - fetch general headlines
        data = await fetchTopHeadlines();
      }

      setArticles(data.articles || []);
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, fetchNews };
}
