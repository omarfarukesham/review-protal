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
  const {reviewId} =  params;

  const review = await getReviewById(reviewId);

  if (!review) return notFound();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-200">
      <ReviewDetails reviewItem={review} />
    </div>
  );
}
