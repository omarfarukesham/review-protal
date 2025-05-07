import Image from "next/image";
import { Card } from "../ui/card";
import { ReviewRating } from "./review-rating";
import { Button } from "../ui/button";
import Link from "next/link";
import premiumLogo from "@/assets/crown.png";

interface ReviewCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  rating: number;
  name: string;
  date: string;
  content: string;
  upVotes: number;
  downVotes: number;
  verified: boolean;
}

export function ReviewCard({
  id,
  title,
  category,
  imageUrl,
  rating,
  name,
  date,
  content,
  upVotes,
  downVotes,
  verified,
}: ReviewCardProps) {

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          {verified && (
            <Image src={premiumLogo} height={28} width={28} alt="Premium" />
          )}
        </div>

        <div className="w-fit bg-blue-400 rounded text-xs text-white px-1">
          {category}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ReviewRating rating={rating} />
        <span className="text-sm text-gray-600">{rating}.0</span>
      </div>

      <div className="text-sm text-gray-500 ">
        By <span className="italic text-orange-400 font-bold">{name}</span> on{" "}
        {new Date(date).toLocaleDateString()}
      </div>

      <p className="text-gray-700 line-clamp-3">{content}</p>

        <Link
          href={`/reviews/${id}`}
          key={id}
          className="block transition-transform hover:translate-x-1"
        >
          <Button variant={"outline"} className="text-blue-400  hover:cursor-pointer">
            Read More
          </Button>
        </Link>
      <Image
        src={imageUrl}
        alt="Product Image"
        height={300}
        width={300}
        className="object-cover rounded border"
      />

      <div className="text-sm text-gray-500">
        <span className="text-orange-400 font-bold">{upVotes + downVotes}</span>{" "}
        people voted
      </div>
    </Card>
  );
}