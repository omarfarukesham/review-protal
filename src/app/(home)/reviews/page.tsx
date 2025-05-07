import type { Metadata } from "next";
import ReviewsList from "@/components/reviews/review-list";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Browse and filter customer reviews",
};

const ReviewsPage = () => {
  return <ReviewsList />;
};

export default ReviewsPage;
