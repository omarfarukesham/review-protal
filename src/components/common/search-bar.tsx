"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get("searchTerm");

    if (typeof search === "string" && search.trim()) {
      const params = new URLSearchParams({ searchTerm: search });
      router.push(`/reviews?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" 
          strokeWidth={1.5}
        />
        <Input
          name="searchTerm"
          type="search"
          placeholder="Search reviews by keyword..."
          className="pl-12 pr-32 py-7 w-full border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-md shadow-sm text-gray-800 placeholder:text-gray-400 transition-all"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white font-medium transition-colors group"
        >
          <span>Search</span>
          <Search className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
        </Button>
      </div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg -z-10 opacity-50"></div>
    </form>
  );
}