/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, Clock, Tag } from "lucide-react";
import Image from "next/image";
import { TReviewCard } from "@/types/globals";
import { formatDistanceToNow } from "date-fns";

export default function ReviewHomeCard({ review }: { review: TReviewCard }) {
  const [upvotes, setUpvotes] = useState(42);
  const [downvotes, setDownvotes] = useState(7);
  const [userVote, setUserVote] = useState<string | null>(null);
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={
            i <= rating
              ? "text-gray-900 fill-gray-900 dark:text-gray-100 dark:fill-gray-100"
              : "text-gray-300 dark:text-gray-600"
          }
        />
      );
    }
    return stars;
  };

  // Handle voting
  const handleVote = (type: string) => {
    if (userVote === type) {
      // Cancel vote
      if (type === "up") setUpvotes(upvotes - 1);
      else setDownvotes(downvotes - 1);
      setUserVote(null);
    } else if (userVote === null) {
      // New vote
      if (type === "up") setUpvotes(upvotes + 1);
      else setDownvotes(downvotes + 1);
      setUserVote(type);
    } else {
      // Change vote
      if (type === "up") {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      } else {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setUserVote(type);
    }
  };

  // Get category badge color - keeping monochrome theme
  const getCategoryColor = (category: string) => {
    const categories = {
      Books: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      Gadgets: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      Movies: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      Food: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };

    return (
      categories[category as keyof typeof categories] ||
      "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    );
  };

  return (
    <div className="h-96 flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      {/* Product Image - Fixed height */}
      <div className="h-40 overflow-hidden">
        <Image
          src={review?.imageUrl!}
          alt={review.title || "Product image"}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              review.category
            )}`}
          >
            <div className="flex items-center">
              <Tag size={12} className="mr-1" />
              {review.category || "General"}
            </div>
          </span>

          {/* Star Rating */}
          <div className="flex">{renderStars(review.RatingSummary || 5)}</div>
        </div>

        {/* Review Title */}
        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white line-clamp-1">
          {review.title || "Product Review"}
        </h3>

        {/* Author and Date */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="mr-2">{review.user.name || "Anonymous"}</span>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {/* formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })
             */}
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
            {/* {review.createdAt || "Recent"} */}
          </div>
        </div>

        {/* Review Snippet */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">
          {review.description || "No description available for this review."}
        </p>

        {/* Voting and Read More */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-3">
            <button
              className={`flex items-center space-x-1 ${
                userVote === "up"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } hover:text-gray-900 dark:hover:text-white transition-colors`}
              onClick={() => handleVote("up")}
              aria-label="Upvote"
            >
              <ThumbsUp
                size={16}
                className={
                  userVote === "up" ? "fill-gray-900 dark:fill-white" : ""
                }
              />
              <span className="text-xs">{review.upVotes}</span>
            </button>
            <button
              className={`flex items-center space-x-1 ${
                userVote === "down"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } hover:text-gray-900 dark:hover:text-white transition-colors`}
              onClick={() => handleVote("down")}
              aria-label="Downvote"
            >
              <ThumbsDown
                size={16}
                className={
                  userVote === "down" ? "fill-gray-900 dark:fill-white" : ""
                }
              />
              <span className="text-xs">{review.downVotes}</span>
            </button>
          </div>

          <a
            href={`/reviews/${review.id}`}
            className="inline-block px-3 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
