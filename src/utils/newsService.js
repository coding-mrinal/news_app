export const newsStorage = {
  // Get all saved articles from localStorage
  getSavedArticles: () => {
    try {
      const savedArticles = localStorage.getItem('savedNews');
      return savedArticles ? JSON.parse(savedArticles) : {};
    } catch (error) {
      console.error('Error reading saved articles:', error);
      return {};
    }
  },

  // Save an article
  saveArticle: (article) => {
    const savedArticles = newsStorage.getSavedArticles();
    // Use URL as unique key
    savedArticles[article.url] = { ...article, savedAt: new Date().toISOString() };
    
    try {
      localStorage.setItem('savedNews', JSON.stringify(savedArticles));
      return true;
    } catch (error) {
      console.error('Error saving article:', error);
      return false;
    }
  },

  // Remove an article
  removeArticle: (articleUrl) => {
    const savedArticles = newsStorage.getSavedArticles();
    
    if (savedArticles[articleUrl]) {
      delete savedArticles[articleUrl];
      try {
        localStorage.setItem('savedNews', JSON.stringify(savedArticles));
        return true;
      } catch (error) {
        console.error('Error removing article:', error);
        return false;
      }
    }
    
    return false;
  },

  // Check if an article is saved
  isArticleSaved: (articleUrl) => {
    const savedArticles = newsStorage.getSavedArticles();
    return !!savedArticles[articleUrl];
  },

  // Get all saved articles
  getAllSavedArticles: () => {
    const savedArticles = newsStorage.getSavedArticles();
    return Object.values(savedArticles);
  }
};