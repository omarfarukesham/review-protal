"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  reviewId: string;
  user: {
    name: string;
    imageUrl: string | null;
  };
}

interface ArticleCommentsProps {
  articleId: string;
}

export default function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const API_URL =
    "https://backend-server-review-portal.vercel.app/api/v1/comment";

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/${articleId}`);

        if (!response.ok) throw new Error("Failed to fetch comments");

        const responseData = await response.json();
        const commentsData = responseData?.data || responseData; // Handle both wrapped and direct array responses

        // Transform the API data to match our expected format
        const formattedComments = Array.isArray(commentsData)
          ? commentsData.map((comment) => ({
              id: comment.id,
              content: comment.content,
              userId: comment.userId,
              userName: comment.user?.name || "Anonymous",
              userAvatar: comment.user?.imageUrl || undefined,
              createdAt: comment.createdAt,
              reviewId: comment.reviewId,
              user: comment.user || { name: "Anonymous", imageUrl: null },
            }))
          : [];

        setComments(formattedComments);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsError(true);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user?.token) return;

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.token}`,
        },
        body: JSON.stringify({
          reviewId: articleId,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const createdComment = await response.json();

      // Transform the new comment to match our format
      const formattedComment = {
        id: createdComment.id,
        content: createdComment.content,
        userId: createdComment.userId || session.user.id,
        userName: session.user.name || "You",
        userAvatar: session.user.image || undefined,
        createdAt: createdComment.createdAt || new Date().toISOString(),
        reviewId: createdComment.reviewId,
        user: {
          name: session.user.name || "You",
          imageUrl: session.user.image || null,
        },
      };

      setComments((prev) => [formattedComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading comments...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load comments
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            {session?.user?.image ? (
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white mr-2">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-3 bg-gray-100 rounded text-center">
          Please sign in to leave a comment
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 border-b">
              {comment?.user?.imageUrl ? (
                <Image
                  src={comment.user?.imageUrl || "/default-avatar.png"}
                  alt={comment.user?.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white mr-2">
                  {comment?.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {comment.user?.name || "Anonymous"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-800">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
