"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function SortDropdown() {
  const router = useRouter();

  // sort data
  const sortData: Record<
    string,
    { label: string; sortBy: string; sortOrder: "asc" | "desc" }
  > = {
    "Most Recent": {
      label: "Most Recent",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    "Highest Rated": {
      label: "Highest Rated",
      sortBy: "RatingSummary",
      sortOrder: "desc",
    },
    "Lowest Rated": {
      label: "Lowest Rated",
      sortBy: "RatingSummary",
      sortOrder: "asc",
    },
    "Most Helpful": {
      label: "Most Helpful",
      sortBy: "upVotes",
      sortOrder: "desc",
    },
    "Most Critical": {
      label: "Most Critical",
      sortBy: "downVotes",
      sortOrder: "desc",
    },
  };

  //add the sortby and sortorder into params
  const sortChange = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams();
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    router.push(`/reviews?${params.toString()}`);
  };

  const [sortOption, setSortOption] = useState<string | null>(null);

  //access the sortBy and sortOrder and pass it to sortchange
  const handleSortChange = (option: string) => {
    setSortOption(option);
    const sort = sortData[option];
    if (sort) {
      sortChange(sort.sortBy, sort.sortOrder);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
        >
          Sort by
          <ChevronDown className="h-4 w-4 ml-1 text-amber-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-stone-200">
        {Object.keys(sortData).map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleSortChange(option)}
            className={`${
              sortOption === option
                ? "bg-amber-50 text-amber-800"
                : "text-stone-700"
            } focus:bg-amber-50 focus:text-amber-800`}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
