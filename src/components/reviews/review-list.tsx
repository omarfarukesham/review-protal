"use client";
import React, { useCallback } from "react";
import useFetch from "@/hooks/useDataFetch";
import { getReviews } from "@/Services/Reviews";
import { SearchBar } from "../common/search-bar";
import { FilterSidebar } from "./filter-sidebar";
import { SortDropdown } from "../common/sort-dropdown";
import { ReviewCard } from "../common/review-card";
import { Pagination } from "../common/pagination";
import CustomLoader from "../common/custom-loader";
import { useSearchParams } from "next/navigation";
import { TReview } from "@/types/globals";

const ReviewsList = () => {
  const searchParams = useSearchParams();

  //params data
  const searchTerm = searchParams.get("searchTerm");
  const RatingSummary = searchParams.get("RatingSummary");
  const date = searchParams.get("date");
  const category = searchParams.get("category");
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const filteredQueryData = React.useMemo(() => {
    //set the params data to a objects
    const queryData = {
      searchTerm,
      RatingSummary,
      date,
      category,
      page,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    };

    return Object.fromEntries(
      Object.entries(queryData).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );
  }, [
    searchTerm,
    RatingSummary,
    date,
    category,
    page,
    sortBy,
    sortOrder,
    startDate,
    endDate,
  ]);

  //call back function to fetch data
  const fetchReviews = useCallback(() => {
    return getReviews(filteredQueryData);
  }, [filteredQueryData]);

  const { data, loading } = useFetch(fetchReviews);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with modern, minimalist styling */}
          <div className="relative mb-12 text-center">
            <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 -z-10"></div>
            <h1 className="inline-block px-8 text-4xl font-serif font-bold text-black bg-white relative">
              Customer Reviews
            </h1>
          </div>

          {/* Search Bar with clean styling */}
          <div className="mb-10 max-w-3xl mx-auto">
            <SearchBar />
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Filter Sidebar */}
            <div className="w-full md:w-72 shrink-0">
              <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Controls with monochromatic styling */}
              <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <p className="text-gray-600 font-light">
                  Showing{" "}
                  {data?.data?.length > 10
                    ? data?.meta?.limit
                    : data?.data?.length}{" "}
                  of {data?.meta?.total} reviews
                </p>
                <SortDropdown />
              </div>

              {/* Reviews List with enhanced spacing */}
              {data?.data?.length !== 0 ? (
                <div className="grid gap-8">
                  {!loading ? (
                    data?.data?.map((review: TReview) => (
                      <ReviewCard
                        key={review?.id}
                        id={review?.id as string}
                        title={review?.title}
                        category={review.category as string}
                        imageUrl={review?.imageUrl as string}
                        rating={review?.RatingSummary as number}
                        name={review?.user.name as string}
                        date={review?.createdAt as string}
                        content={review?.description as string}
                        upVotes={review?.upVotes as number}
                        downVotes={review?.downVotes as number}
                        verified={review?.isPremium as boolean}
                      />
                    ))
                  ) : (
                    <CustomLoader />
                  )}
                </div>
              ) : (
                <div className="w-full h-[60vh] flex items-center justify-center">
                  <p className="text-lg font-medium text-gray-800">
                    No reviews available
                  </p>
                </div>
              )}

              {/* Pagination with minimalist design */}
              {data?.data?.length >= 5 && (
                <div className="mt-16 relative">
                  <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 -z-10"></div>
                  <div className="flex justify-center">
                    <div className="inline-block px-6 bg-white">
                      <Pagination
                        totalPages={data?.meta?.totalPage}
                        currentPage={data?.meta?.page}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
