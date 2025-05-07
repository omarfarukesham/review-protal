import { getReviews } from "@/Services/Reviews";
import React from "react";
import ReviewHomeCard from "./ReviewCard";
import { TReviewCard } from "@/types/globals";
import Link from "next/link";

const ReviewSection = async () => {
  const reviews = await getReviews({
    page: 1,
    limit: 4,
  });

  return (
    <section className="w-full py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Discover the Best Products Reviewed by Experts and Users Like You
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Explore our extensive collection of product reviews across various
            categories. Our platform connects you with genuine insights from
            real users and experts. Make informed decisions before your next
            purchase!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews?.data?.length > 0 &&
            reviews?.data?.map((review: TReviewCard) => (
              <div key={review.id} className="h-96">
                <ReviewHomeCard review={review} />
              </div>
            ))}
        </div>

        {reviews?.data?.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center px-6 py-3 border border-gray-800 dark:border-gray-200 text-base font-medium rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              View All Reviews
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
