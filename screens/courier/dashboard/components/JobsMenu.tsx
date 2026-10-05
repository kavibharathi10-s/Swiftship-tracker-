import React from "react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Search, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobsMenuProps {
  onSortChange: (sortType: string) => void;
}

interface JobsMenuProps {
  onSortChange: (sortType: string) => void;
  onSearch: (searchTerm: string) => void;
}

const JobsMenu: React.FC<JobsMenuProps> = ({ onSortChange, onSearch }) => {
  const [activeTab, setActiveTab] = useState<string>("mostRecent");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSortChange = (sortType: string) => {
    setActiveTab(sortType);
    onSortChange(sortType);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
    setShowMobileSearch(false);
  };

  return (
    <div className="mb-8">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex flex-wrap items-center justify-between space-x-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => handleSortChange("mostRecent")}
                  className={`hover:text-black py-2 cursor-pointer font-medium ${
                    activeTab === "mostRecent"
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500"
                  }`}
                >
                  Most Recent
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => handleSortChange("highestPaying")}
                  className={`hover:text-black py-2 cursor-pointer font-medium ${
                    activeTab === "highestPaying"
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500"
                  }`}
                >
                  Highest Paying
                </NavigationMenuLink>
              </NavigationMenuItem>
            </div>

            <NavigationMenuItem className="flex items-center ml-2 flex-grow max-w-sm">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pr-8"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <ChevronDown className="h-5 w-5" /> <p>Filter</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleSortChange("mostRecent")}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleSortChange("highestPaying")}
              >
                Highest Paying
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="relative mt-4">
            <Input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pr-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsMenu;
