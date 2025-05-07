import ReviewDetails from "@/components/ReviewDetails";
import { TReview } from "@/types/globals";
import { notFound } from "next/navigation";

async function getReviewById(id: string): Promise<TReview | null> {
  try {
    const res = await fetch(
      `https://backend-server-review-portal.vercel.app/api/v1/review/${id}`,
      {
        cache: "no-store",
      }
    );
    const json = await res.json();

    if (!res.ok || !json.success) return null;

    return json.data;
  } catch {
    return null;
  }
}

export default async function ReviewPage({ params }: { params: { reviewId: string } }) {
  // Instead of accessing params directly, let's await it first
  // This is unconventional but seems to be what the error message is suggesting
  let review: TReview | null = null;
  
  try {
    // Wrap the entire operation in a try/catch to handle any potential errors
    const awaitedParams = await Promise.resolve(params);
    review = await getReviewById(awaitedParams.reviewId);
  } catch (error) {
    console.error("Error fetching review:", error);
    return notFound();
  }

  if (!review) return notFound();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-200">
      <ReviewDetails reviewItem={review} />
    </div>
  );
}