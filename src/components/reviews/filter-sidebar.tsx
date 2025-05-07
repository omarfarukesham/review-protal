"use client";

import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export function FilterSidebar() {
  const router = useRouter();
  // query params
  const [params, setParams] = useState<Record<string, unknown>>({
    RatingSummary: null,
    category: "",
    startDate: "",
    endDate: "",
  });

  const searchParams = new URLSearchParams();

  //filtered the empty params
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  ) as Record<string, string | number>;

  //set the filtered params into searchUrl
  Object.entries(filteredParams).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  //apply filter
  const onClickApplyFilters = () => {
    router.push(`/reviews?${searchParams.toString()}`);
  };

  // clear all filter
  const onClickResetAll = () => {
    setParams({
      RatingSummary: null,
      category: "",
      startDate: "",
      endDate: "",
    });
    router.push(`/reviews`);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="font-serif text-xl text-black mb-6 pb-3 border-b border-gray-200 tracking-tight">
        Refine Results
      </h2>

      <Accordion
        type="multiple"
        defaultValue={["rating", "categories"]}
        className="border-none"
      >
        <AccordionItem value="rating" className="border-b border-gray-100">
          <AccordionTrigger className="py-3 text-gray-800 hover:text-black font-medium hover:no-underline transition-colors">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-1 py-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="radio"
                    onChange={() =>
                      setParams((prev) => ({
                        ...prev,
                        RatingSummary:
                          prev.RatingSummary === rating ? null : rating,
                      }))
                    }
                    checked={params.RatingSummary === rating}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-gray-500"
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center gap-1.5 text-gray-700 cursor-pointer select-none"
                  >
                    {rating}{" "}
                    <Star className="h-3.5 w-3.5 fill-gray-800 text-gray-800" />{" "}
                    & Up
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories" className="border-b border-gray-100">
          <AccordionTrigger className="py-3 text-gray-800 hover:text-black font-medium hover:no-underline transition-colors">
            Product Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-1 py-2">
              {["MOVIE", "TV_SHOW", "BOOK", "ELECTRONICS", "VEHICLE"].map(
                (category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`category-${category.toLowerCase()}`}
                      name="radio1"
                      onChange={() =>
                        setParams((prev) => ({
                          ...prev,
                          category: prev.category === category ? "" : category,
                        }))
                      }
                      checked={params.category === category}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-500"
                    />

                    <Label
                      htmlFor={`category-${category.toLowerCase()}`}
                      className="text-gray-700 cursor-pointer select-none"
                    >
                      {formatCategoryName(category)}
                    </Label>
                  </div>
                )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 space-y-3">
        <Button
          onClick={onClickApplyFilters}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium transition-colors"
        >
          Apply Filters
        </Button>
        <Button
          onClick={onClickResetAll}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}

// Helper function to format category names
function formatCategoryName(category: string): string {
  // Convert snake case to title case with spaces
  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
