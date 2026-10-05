"use client";
import { UserButton } from "@clerk/nextjs";

export default function RegHeader() {
  return (
    <header className="w-full bg-white shadow-lg">
      {/* Main Navigation */}
      <nav className="container mx-auto p-4">
        {/* Row 1: Logo and Navigation Menu for large screens */}
        <div className="flex items-center justify-between">
          {/* Left side: Logo and Navigation Menu */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="font-bold text-lg text-gray-800">Ship Swift</div>
          </div>

          {/* Right side: Search Bar and User Button */}
          <div className="flex flex-row justify-end w-[20%]">
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
