import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Adjust the path as necessary
import LocationTracker from "@/screens/track-delivery/LocationTracker";
import Link from "next/link";

// Define the types for the menu items
type NavItem = {
  label: string;
  href?: string; // Optional if the item has a direct link
  dropdownItems?: {
    label: string;
    href: string;
  }[]; // Optional for dropdown items
};

interface NavMenuProps {
  items: NavItem[]; // Array of navigation items
  isDriver?: Boolean;
  hasActiveJobs?: Boolean;
  onClose?: () => void; // Callback to close the sheet
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  isDriver,
  hasActiveJobs,
  onClose,
}) => {
  const updateLocation = async (lat: number, lng: number) => {
    // just here, doing nothing
  };
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col items-start lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {items.map((item, index) => (
          <NavigationMenuItem key={index} className="flex items-center">
            {item.dropdownItems ? (
              <>
                <NavigationMenuTrigger className="text-gray-800 hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-lg rounded-md p-4">
                  {item.dropdownItems.map((dropdownItem, idx) => (
                    <NavigationMenuLink
                      key={idx}
                      href={dropdownItem.href}
                      onClick={onClose}
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      {dropdownItem.label}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <Link
                href={item.href || "#"}
                prefetch={true}
                onClick={onClose}
                className="text-gray-800 hover:bg-gray-100 p-2 rounded transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </NavigationMenuItem>
        ))}
        {isDriver && (
          <div className="hidden lg:flex">
            <LocationTracker updateLocation={updateLocation} />
          </div>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
