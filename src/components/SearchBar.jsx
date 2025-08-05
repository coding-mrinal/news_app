import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  isLoading, 
  onCategoryChange, 
  category 
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchQuery]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onCategoryChange?.(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search headlines, sources..."
          className="pl-9 pr-10 py-5 text-base"
        />
        {localSearchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setLocalSearchTerm("");
              setSearchQuery("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px] py-5">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="politics">Politics</SelectItem>
          <SelectItem value="health">Health</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        onClick={() => onSearch()} 
        disabled={isLoading}
        className={cn("py-5", isLoading && "opacity-75")}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}

export default SearchBar;