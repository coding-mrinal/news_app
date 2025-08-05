import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { Button } from "@/components/ui/button";
import { newsStorage } from "@/utils/newsService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bookmark, ArrowRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function SavedNewsPage() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadSavedArticles = () => {
      try {
        setIsLoading(true);
        const articles = newsStorage.getAllSavedArticles();
        const sortedArticles = articles.sort((a, b) => 
          new Date(b.savedAt) - new Date(a.savedAt)
        );
        setSavedArticles(sortedArticles);
      } catch (error) {
        console.error('Error loading saved articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedArticles();
  }, []);

  const handleDelete = (url) => {
    newsStorage.removeArticle(url);
    setSavedArticles(savedArticles.filter(article => article.url !== url));
  };

  const filteredArticles = activeTab === "all" 
    ? savedArticles 
    : savedArticles.filter(article => article.category === activeTab);

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Articles</h1>
            <p className="text-muted-foreground">
              Your personal collection of news stories
            </p>
          </div>
          <div className="text-muted-foreground">
            {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''}
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {Array.from(new Set(savedArticles.map(a => a.category)))
              .filter(Boolean)
              .map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <NewsCard key={index} variant="skeleton" />
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div key={article.url} className="relative group">
                    <NewsCard article={article} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(article.url);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Alert className="text-center">
                <Bookmark className="h-4 w-4" />
                <AlertTitle>No saved articles</AlertTitle>
                <AlertDescription>
                  {activeTab === "all" 
                    ? "You haven't saved any articles yet."
                    : `You haven't saved any ${activeTab} articles.`}
                  <Button variant="link" className="ml-2 p-0 h-auto" asChild>
                    <a href="/">
                      Browse news <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SavedNewsPage;