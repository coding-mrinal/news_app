import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { Moon, Sun, Settings, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function SettingsPanel({ onThemeChange, onSaved }) {
  const [theme, setTheme] = useState("system");
  const [savedCategories, setSavedCategories] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const categories = [
    "business",
    "technology",
    "sports",
    "politics",
    "health",
    "entertainment",
    "science"
  ];

  const handleSave = () => {
    // In a real app, save to localStorage or API
    onSaved?.();
    toast.success("Preferences saved", {
      description: "Your settings have been updated",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Customize your theme preference
              </p>
            </div>
            <Select 
              value={theme} 
              onValueChange={(value) => {
                setTheme(value);
                onThemeChange?.(value);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label className="font-medium">Preferred Categories</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select your favorite news categories
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = savedCategories.includes(category);
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isSelected) {
                        setSavedCategories(savedCategories.filter(c => c !== category));
                      } else {
                        setSavedCategories([...savedCategories, category]);
                      }
                    }}
                    className="capitalize"
                  >
                    {category}
                    {isSelected && <Check className="h-4 w-4 ml-1" />}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between space-x-4">
            <div>
              <Label className="font-medium">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get updates on breaking news
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full mt-2"
          >
            Save Preferences
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SettingsPanel;