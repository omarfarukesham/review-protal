/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  MoreHorizontal,
  Eye,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import { deleteReview, getMyReviews } from "@/Services/Reviews";
import { SkeletonRow } from "../ReviewTableSkeleton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TReviewCard } from "@/types/globals";
import Image from "next/image";

export default function ReviewManagementTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<TReviewCard[]>([]);
  useEffect(() => {
    const MyReviews = async () => {
      const res = await getMyReviews();
      setReviews(res.data);
      setLoading(false);
    };
    MyReviews();
  }, [loading]);
  // Sample data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<TReviewCard | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  // console.log({ session }," from review management");
  const getCategoryColor = (category: string) => {
    const categoryColors = {
      BOOK: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      ELECTRONICS:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      MOVIE:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      TV_SHOW:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      VEHICLE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdateReview = (reviewId: string) => {
    router.push(
      `/dashboard/${session?.user.role.toLowerCase()}/update-review/${reviewId}`
    );
  };

  const openDeleteDialog = (review: TReviewCard) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    const loadingId = toast.loading("Deleting...");
    setLoading(true);
    const result = await deleteReview(reviewToDelete?.id!);
    if (result.success) {
      toast.success(result.message, { id: loadingId });
      setLoading(false);
    } else {
      toast.error(result.message, { id: loadingId });
    }
    // After successful deletion, you would typically refresh the data

    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const renderStars = (rating: number) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
      ));
  };

  return (
    <div className="w-full">
      {/* Main Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto min-h-[500px] relative">
          <table className="w-full divide-y   divide-gray-200 dark:divide-gray-800  ">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[250px]"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]"
                >
                  Engagement
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[120px]"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_:any, index) => (
                      <SkeletonRow key={`skeleton-${index}`} />
                    ))
                : reviews?.map((review: TReviewCard) => (
                    <tr
                      key={review.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={review.imageUrl}
                              alt={review.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="max-w-[150px] sm:max-w-xs">
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {review.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {review.isPremium && (
                                <span className="inline-flex items-center mr-2 text-xs font-medium text-emerald-700 dark:text-emerald-500">
                                  Premium ${review.price}
                                </span>
                              )}
                              {review.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            review.category
                          )}`}
                        >
                          {review.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {renderStars(review.RatingSummary)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <ThumbsUp size={14} className="mr-1" />
                            {review.upVotes}
                          </span>
                          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <ThumbsDown size={14} className="mr-1" />
                            {review.downVotes}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {review.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            onClick={() => toggleDropdown(review.id)}
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {dropdownOpen[
                            review.id as keyof typeof dropdownOpen
                          ] && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <Link
                                  href={`/reviews/${review.id}`}
                                  className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
                                    review.isPublished ? "" : "hidden"
                                  }`}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  onClick={() => {
                                    handleUpdateReview(review.id);
                                    toggleDropdown(review.id);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                                  onClick={() => {
                                    openDeleteDialog(review);
                                    toggleDropdown(review.id);
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-900 absolute bottom-0 w-full">
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Showing {1} of {1} reviews
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/15  backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center text-red-600 dark:text-red-500 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Delete Review</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the review &quote;
              {reviewToDelete?.title}&quote;? This action cannot be undone and will
              permanently remove the review and all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={handleDeleteReview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
