import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bookmark, Share2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { newsStorage } from "../utils/newsService";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";

export default function NewsCard({ article, variant = "default" }) {
  // Return skeleton component early without needing article data
  if (variant === "skeleton") {
    return (
      <Card className="overflow-hidden border border-muted">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  // For non-skeleton variant, we need article data
  if (!article) return null;

  const { title, description, urlToImage, url, source, category, publishedAt } = article;
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsSaved(newsStorage.isArticleSaved(url));
  }, [url]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      newsStorage.removeArticle(url);
      setIsSaved(false);
      toast.success('Removed from saved articles');
    } else {
      newsStorage.saveArticle(article);
      setIsSaved(true);
      toast.success('Saved article');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.info('Link copied to clipboard');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      toast.error('Failed to share article');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full flex flex-col border border-muted"
      onClick={() => window.open(url, '_blank')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {urlToImage && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={urlToImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400?text=News+Image';
            }}
          />
          {category && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
            >
              {category}
            </Badge>
          )}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-sm text-white">
                {source?.name || "Unknown source"} • {formatDate(publishedAt)}
              </p>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {description || "No description available."}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-between gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isSaved ? 'text-primary' : ''}`}
              onClick={toggleBookmark}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isSaved ? 'Remove bookmark' : 'Save for later'}</TooltipContent>
        </Tooltip>
        
        <Button variant="outline" className="flex-1" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Read
          </a>
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share article</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}