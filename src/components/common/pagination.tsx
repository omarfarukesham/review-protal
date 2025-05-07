"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();

  const [page, setPage] = React.useState(currentPage);

  const getPageButtons = () => {
    const total = totalPages

    if (total <= 4) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "...", total];
    }

    if (page >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const handleClick = (btn: string | number) => {
    if (btn === "...") return;
    setPage(Number(btn));
    const params = new URLSearchParams({ page: String(Number(btn)) });
    router.push(`/reviews?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => handleClick(page - 1)}
        aria-label="Previous page"
        className="border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageButtons().map((p, i) => (
        <Button
          key={i}
          variant={page === p ? "default" : "outline"}
          size="icon"
          className={`w-9 ${
            page === p
              ? "bg-amber-700 hover:bg-amber-800 text-white"
              : "border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
          }`}
          onClick={() => handleClick(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => handleClick(page + 1)}
        aria-label="Next page"
        className="border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
