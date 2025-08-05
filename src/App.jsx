import { useState, useEffect } from "react";
import NewsCard from "./components/NewsCard";
import SearchBar from "./components/SearchBar";
import NewsCategories from "./components/NewsCategories";
import SettingsPanel from "./components/SettingsPanel";
import SavedNewsPage from "./components/SavedNewsPage";
import { useNews } from "./hooks/useNews.js";
import ThemeToggle from "./components/ThemeToggle";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const { articles, loading, error, fetchNews } = useNews();

  // Load initial news on component mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = () => {
    fetchNews(searchQuery || undefined);
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    // Map 'all' category to empty string for API
    const apiCategory = selectedCategory === "all" ? "" : selectedCategory;
    fetchNews(apiCategory);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header Bar */}
        <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">NewsHub</h1>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-sm font-medium hover:text-primary">
                  Home
                </Link>
                <Link to="/saved" className="text-sm font-medium hover:text-primary">
                  Saved Articles
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SettingsPanel 
                onThemeChange={(theme) => document.documentElement.classList.toggle('dark', theme === 'dark')}
                onSaved={() => console.log('Preferences saved')}
              />
            </div>
          </div>
        </header>
        
        <main className="py-6">
          <Routes>
            <Route 
              path="/"
              element={
                <HomeView 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  category={category}
                  setCategory={setCategory}
                  handleSearch={handleSearch}
                  loading={loading}
                  error={error}
                  articles={articles}
                  handleCategoryChange={handleCategoryChange}
                  fetchNews={fetchNews}
                />
              }
            />
            <Route path="/saved" element={<SavedNewsPage />} />
          </Routes>
        </main>
        
        <footer className="border-t py-6">
          <div className="container flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NewsHub. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                About
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </footer>
        
        <Toaster position="bottom-right" richColors />
      </div>
    </Router>
  );
}

// Home view component to keep App clean
function HomeView({ 
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  handleSearch,
  loading,
  error,
  articles,
  handleCategoryChange,
  fetchNews
}) {
  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Stay Informed</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover the latest news from around the world. Customize your feed to match your interests.
        </p>
      </div>
      
      <NewsCategories 
        activeCategory={category || "all"} 
        onCategoryChange={handleCategoryChange} 
        isLoading={loading}
      />
      
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isLoading={loading}
          category={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      {error && (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive mb-6 max-w-2xl mx-auto">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <NewsCard key={index} variant="skeleton" />
          ))
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">
              No news articles found. Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </>
  );
}



export default App;