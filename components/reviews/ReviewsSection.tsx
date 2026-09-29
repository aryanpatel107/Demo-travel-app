"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";
import { StarRating } from "./StarRating";
import { ApiError, apiFetch } from "@/lib/apiClient";

type Review = {
  id: string;
  userName: string;
  destinationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isOwnReview: boolean;
};

type DestinationReviews = {
  summary: {
    destinationId: string;
    averageRating: number;
    reviewCount: number;
  };
  reviews: Review[];
};

export function ReviewsSection({ destinationId }: { destinationId: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [data, setData] = useState<DestinationReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const response = await apiFetch<DestinationReviews>(
        `/api/reviews?destinationId=${encodeURIComponent(destinationId)}`
      );
      setData(response);
      setError(null);
    } catch {
      setError("Could not load reviews right now.");
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (!cancelled) {
        await loadReviews();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadReviews]);

  async function handleSubmit() {
    if (rating < 1) {
      showToast("Please choose a star rating.", "error");
      return;
    }

    if (comment.trim().length < 3) {
      showToast("Please write a short comment (at least 3 characters).", "error");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ destinationId, rating, comment: comment.trim() }),
      });

      showToast("Review submitted, thank you!", "success");
      setRating(0);
      setComment("");
      await loadReviews();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        showToast("Please log in to leave a review.", "error");
      } else {
        showToast("Could not submit your review. Please try again.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId: string) {
    setDeletingId(reviewId);

    try {
      await apiFetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      showToast("Review removed.", "success");
      await loadReviews();
    } catch {
      showToast("Could not remove your review. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
        {data && data.summary.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(data.summary.averageRating)} readOnly />
            <span className="text-sm text-slate-600">
              {data.summary.averageRating.toFixed(1)} ({data.summary.reviewCount} review{data.summary.reviewCount > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Submit form — only shown to logged-in users */}
      {user ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-700">Leave a review</p>
          <StarRating value={rating} onChange={setRating} size={24} />
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="Share your experience..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </div>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
          Log in to leave a review.
        </p>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !data || data.reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet — be the first to share your experience.</p>
      ) : (
        <ul className="space-y-4">
          {data.reviews.map((review) => (
            <li key={review.id} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.userName}</p>
                  <StarRating value={review.rating} readOnly size={16} />
                </div>
                {review.isOwnReview && (
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === review.id ? "Removing..." : "Delete"}
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-700">{review.comment}</p>
              <p className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}