"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useGetReviewQuery,
  useUpdateVoteMutation,
} from "@/redux/services/reviewApi";
import ArticleComments from "./reviews/chat";
import { ThumbsUp, ThumbsDown, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
// import { Button } from "./ui/button";
import CustomLoader from "./common/custom-loader";
import { TReview } from "@/types/globals";
import { useSession } from "next-auth/react";
import { useGetMyPaymentsQuery } from "@/redux/services/paymentApi";

type TCurrentUserWithReviewId = {
  email: string;
  reviewId: string;
};

export default function ReviewDetails({
  reviewItem,
}: {
  reviewItem: TReview | null;
}) {
  const router = useRouter();
  const [isHelpful, setIsHelpful] = useState(0);
  const [isNotHelpful, setIsNotHelpful] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const email = session?.data?.user?.email;

  // RTK Query hooks with proper undefined handling
  const {
    data: review,
    isLoading,
    isError,
    refetch,
  } = useGetReviewQuery(reviewItem?.id || "");
  const { data: myPaymentData } = useGetMyPaymentsQuery(email as string);

  const userPayemntDetails = myPaymentData?.data?.map((info:TCurrentUserWithReviewId) => ({
    email: info?.email,
    reviewId: info?.reviewId,
  }));
  
  const currentReview = (review as any)?.data;

  const currentUserWithReviewId = {
    email,
    reviewId: currentReview?.id,
  };

  const isPaidBefore = userPayemntDetails?.some(
    (item: TCurrentUserWithReviewId) =>
      item.email === currentUserWithReviewId.email &&
      item.reviewId === currentUserWithReviewId.reviewId
  );
  console.log(isPaidBefore, currentUserWithReviewId, userPayemntDetails);


  const [updateVote, { isLoading: isUpdating }] = useUpdateVoteMutation();

  const handleBack = () => router.back();

  const handleVote = async (type: "upVotes" | "downVotes") => {
    try {
      setError(null);

      // Optimistic UI updates
      if (type === "upVotes") {
        setIsHelpful(1);
        setIsNotHelpful(0);
      } else {
        setIsNotHelpful(1);
        setIsHelpful(0);
      }

      await updateVote({
        reviewId: currentReview.id,
        voteType: type,
      }).unwrap();

      await refetch();
    } catch (err) {
      setError("Failed to update vote. Please try again.");
      console.error("Failed to update vote:", err);
      setIsHelpful(0);
      setIsNotHelpful(0);
    }
  };

  const handleHelpful = () => handleVote("upVotes");
  const handleNotHelpful = () => handleVote("downVotes");

  if (isLoading) return <CustomLoader />;

  if (isError)
    return (
      <div className="max-w-5xl mx-auto p-8 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-center h-40">
          <p className="text-lg text-red-500">Error loading review</p>
        </div>
      </div>
    );

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

  return (
    <div className="w-[70%] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with bac button */}
      <div className="bg-foreground px-6 py-4 flex justify-between items-center">
        <h1 className="text-white font-bold text-lg">Review Details</h1>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="p-6">
        {/* Title and author */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {currentReview?.title}
        </h1>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div>
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white mr-2">
              {currentReview?.user?.name?.charAt(0) || "U"}
            </div>
            <span>Posted by {currentReview?.user?.name}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(currentReview?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentReview?.isPremium
                  ? "bg-yellow-400 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {currentReview?.isPremium ? "Premium" : "Standard"}
            </span>
          </div>
        </div>

        {/* Main image */}
        <div className="rounded-lg overflow-hidden shadow-md mb-8">
          <Image
            src={currentReview?.imageUrl || "/static-image.jpg"}
            alt={currentReview?.title}
            layout="responsive"
            width={100}
            height={50}
            className="object-cover"
          />
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Introduction
          </h3>
          <div className="prose max-w-none text-gray-600">
            {currentReview?.isPremium ? (
              <p>{currentReview.description.slice(0, 100)}</p>
            ) : (
              <p>{currentReview.description}</p>
            )}
          </div>
        </div>
        {isPaidBefore ? (
          <div>
            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Category</h3>
                <p className="text-gray-900">
                  {currentReview?.category || "Uncategorized"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Rating</h3>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {renderStars(currentReview?.RatingSummary || 5)}
                  </div>
                  <span className="text-gray-900">
                    {currentReview?.RatingSummary || 0}/5
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                <p className="text-gray-900 font-semibold">
                  &#2547; {currentReview?.price || "0.00"}
                </p>
              </div>
            </div>

            {/* Voting section */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Was this review helpful?
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={handleHelpful}
                  disabled={isUpdating}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isHelpful === 1
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                  } ${
                    isUpdating
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span>Helpful ({currentReview?.upVotes || 0})</span>
                </button>

                <button
                  onClick={handleNotHelpful}
                  disabled={isUpdating}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isNotHelpful === 1
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                  } ${
                    isUpdating
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <ThumbsDown size={18} />
                  <span>Not Helpful ({currentReview?.downVotes || 0})</span>
                </button>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Comments
              </h3>
              <ArticleComments articleId={currentReview?.id} />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="max-w-5xl h-[40vh] flex justify-center items-center blur-lg bg-gray-300 rounded-md"></div>

            <div className="bg-card shadow-xl w-[200px] absolute p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="pb-2">If you want to get access, please pay now</p>
              <Link
                href={`/payment/${currentReview?.id}`}
                key={currentReview?.id}
                className="block transition-transform hover:translate-x-1"
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-full hover:bg-gray-600 hover:cursor-pointer transition-colors shadow-sm">
                  <span>Pay Now</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import {
//   useGetReviewQuery,
//   useUpdateVoteMutation,
// } from "@/redux/services/reviewApi";
// import ArticleComments from "./reviews/chat";
// import { ThumbsUp, ThumbsDown, ArrowLeft, Star } from "lucide-react";
// import Link from "next/link";
// // import { Button } from "./ui/button";
// import CustomLoader from "./common/custom-loader";
// import { TReview } from "@/types/globals";

// export default function ReviewDetails({
//   reviewItem,
// }: {
//   reviewItem: TReview | null;
// }) {
//   const router = useRouter();
//   const [isHelpful, setIsHelpful] = useState(0);
//   const [isNotHelpful, setIsNotHelpful] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   // RTK Query hooks with proper undefined handling
//   const {
//     data: review,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetReviewQuery(reviewItem?.id || "");

//   const [updateVote, { isLoading: isUpdating }] = useUpdateVoteMutation();

//   const currentReview = (review as any)?.data

//   const handleBack = () => router.back();

//   const handleVote = async (type: "upVotes" | "downVotes") => {
//     try {
//       setError(null);

//       // Optimistic UI updates
//       if (type === "upVotes") {
//         setIsHelpful(1);
//         setIsNotHelpful(0);
//       } else {
//         setIsNotHelpful(1);
//         setIsHelpful(0);
//       }

//       await updateVote({
//         reviewId: currentReview.id,
//         voteType: type,
//       }).unwrap();

//       await refetch();
//     } catch (err) {
//       setError("Failed to update vote. Please try again.");
//       console.error("Failed to update vote:", err);
//       setIsHelpful(0);
//       setIsNotHelpful(0);
//     }
//   };

//   const handleHelpful = () => handleVote("upVotes");
//   const handleNotHelpful = () => handleVote("downVotes");

//   if (isLoading) return <CustomLoader />;

//   if (isError)
//     return (
//       <div className="max-w-5xl mx-auto p-8 rounded-lg shadow-sm bg-white">
//         <div className="flex items-center justify-center h-40">
//           <p className="text-lg text-red-500">Error loading review</p>
//         </div>
//       </div>
//     );

//   const renderStars = (rating: number) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Star
//           key={i}
//           size={18}
//           className={
//             i <= rating
//               ? "text-gray-900 fill-gray-900 dark:text-gray-100 dark:fill-gray-100"
//               : "text-gray-300 dark:text-gray-600"
//           }
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="w-[70%] bg-white rounded-lg shadow-sm overflow-hidden">
//       {/* Header with bac button */}
//       <div className="bg-foreground px-6 py-4 flex justify-between items-center">
//         <h1 className="text-white font-bold text-lg">Review Details</h1>
//         <button
//           onClick={handleBack}
//           className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors shadow-sm"
//         >
//           <ArrowLeft size={16} />
//           <span>Back</span>
//         </button>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//               clipRule="evenodd"
//             />
//           </svg>
//           {error}
//         </div>
//       )}

//       <div className="p-6">
//         {/* Title and author */}
//         <h1 className="text-3xl font-bold mb-2 text-gray-800">
//           {currentReview?.title}
//         </h1>
//         <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
//           <div>
//             <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white mr-2">
//               {currentReview?.user?.name?.charAt(0) || "U"}
//             </div>
//             <span>Posted by {currentReview?.user?.name}</span>
//             <span className="mx-2">•</span>
//             <span>
//               {new Date(currentReview?.createdAt).toLocaleDateString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <span
//               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 currentReview?.isPremium
//                   ? "bg-yellow-400 text-yellow-800"
//                   : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {currentReview?.isPremium ? "Premium" : "Standard"}
//             </span>
//           </div>
//         </div>

//         {/* Main image */}
//         <div className="rounded-lg overflow-hidden shadow-md mb-8">
//           <Image
//             src={currentReview?.imageUrl || "/static-image.jpg"}
//             alt={currentReview?.title}
//             layout="responsive"
//             width={100}
//             height={50}
//             className="object-cover"
//           />
//         </div>

//         {/* Introduction */}
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold mb-3 text-gray-800">
//             Introduction
//           </h3>
//           <div className="prose max-w-none text-gray-600">
//             {currentReview?.isPremium ? (
//               <p>{currentReview.description.slice(0, 100)}</p>
//             ) : (
//               <p>{currentReview.description}</p>
//             )}
//           </div>
//         </div>
//         {currentReview?.isPremium !== true ? (
//           <div>
//             {/* Details grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-gray-700 mb-2">Category</h3>
//                 <p className="text-gray-900">
//                   {currentReview?.category || "Uncategorized"}
//                 </p>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-gray-700 mb-2">Rating</h3>
//                 <div className="flex items-center">
//                   <div className="flex items-center mr-2">
//                     {renderStars(currentReview?.RatingSummary || 5)}
//                   </div>
//                   <span className="text-gray-900">
//                     {currentReview?.RatingSummary || 0}/5
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-gray-700 mb-2">Price</h3>
//                 <p className="text-gray-900 font-semibold">
//                   &#2547; {currentReview?.price || "0.00"}
//                 </p>
//               </div>
//             </div>

//             {/* Voting section */}
//             <div className="border-t border-gray-200 pt-6 mb-8">
//               <h3 className="text-lg font-semibold mb-4 text-gray-800">
//                 Was this review helpful?
//               </h3>
//               <div className="flex space-x-4">
//                 <button
//                   onClick={handleHelpful}
//                   disabled={isUpdating}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
//                     isHelpful === 1
//                       ? "bg-green-50 text-green-600 border border-green-200"
//                       : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
//                   } ${
//                     isUpdating
//                       ? "opacity-50 cursor-not-allowed"
//                       : "cursor-pointer"
//                   }`}
//                 >
//                   <ThumbsUp size={18} />
//                   <span>Helpful ({currentReview?.upVotes || 0})</span>
//                 </button>

//                 <button
//                   onClick={handleNotHelpful}
//                   disabled={isUpdating}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
//                     isNotHelpful === 1
//                       ? "bg-red-50 text-red-600 border border-red-200"
//                       : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
//                   } ${
//                     isUpdating
//                       ? "opacity-50 cursor-not-allowed"
//                       : "cursor-pointer"
//                   }`}
//                 >
//                   <ThumbsDown size={18} />
//                   <span>Not Helpful ({currentReview?.downVotes || 0})</span>
//                 </button>
//               </div>
//             </div>

//             {/* Comments section */}
//             <div className="border-t border-gray-200 pt-6">
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">
//                 Comments
//               </h3>
//               <ArticleComments articleId={currentReview?.id} />
//             </div>
//           </div>
//         ) : (
//           <div className="relative">
//             <div className="max-w-5xl h-[40vh] flex justify-center items-center blur-lg bg-gray-300 rounded-md"></div>

//             <div className="bg-card shadow-xl w-[200px] absolute p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <p className="pb-2">If you want to get access, please pay now</p>
//               <Link
//                 href={`/payment/${currentReview?.id}`}
//                 key={currentReview?.id}
//                 className="block transition-transform hover:translate-x-1"
//               >
//                 <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-full hover:bg-gray-600 hover:cursor-pointer transition-colors shadow-sm">
//                   <span>Pay Now</span>
//                 </button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
