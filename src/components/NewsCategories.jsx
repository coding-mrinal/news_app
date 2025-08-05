import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { id: "all", name: "All" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "sports", name: "Sports" },
  { id: "politics", name: "Politics" },
  { id: "health", name: "Health" },
  { id: "entertainment", name: "Entertainment" },
  { id: "science", name: "Science" }
];

function NewsCategories({ activeCategory, onCategoryChange, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-4">
          {categories.map((category) => (
            <Skeleton key={category.id} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full capitalize ${
              activeCategory === category.id ? "shadow-sm" : ""
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default NewsCategories;