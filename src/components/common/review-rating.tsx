import { Star } from "lucide-react"

interface ReviewRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
}

export function ReviewRating({ rating, size = "md" }: ReviewRatingProps) {
  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size]

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  )
}
