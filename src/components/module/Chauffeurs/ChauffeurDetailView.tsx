"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  CaretLeft,
  User,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import {
  useGetChauffeurByIdQuery,
  useGetChauffeurReviewsQuery,
  useCreateChauffeurReviewMutation,
  useDeleteChauffeurReviewMutation,
} from "@/redux/api/chauffeursApi";
import type { ChauffeurReviewFormData } from "@/schemas/review";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";

type Props = {
  chauffeurId: number;
};

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

export default function ChauffeurDetailView({ chauffeurId }: Props) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const {
    data: chauffeur,
    isLoading,
    error,
  } = useGetChauffeurByIdQuery(chauffeurId);

  const { data: reviewsData } = useGetChauffeurReviewsQuery({
    id: chauffeurId,
    page: reviewPage,
  });

  const [createReview, { isLoading: isCreating }] =
    useCreateChauffeurReviewMutation();
  const [deleteReview] = useDeleteChauffeurReviewMutation();

  const reviews = reviewsData?.results ?? [];
  const hasNextReviews = !!reviewsData?.next;
  const hasPreviousReviews = !!reviewsData?.previous;

  const handleCreateReview = useCallback(
    async (data: ChauffeurReviewFormData) => {
      try {
        await createReview({ id: chauffeurId, data }).unwrap();
        toast.success("Review submitted successfully");
        setShowReviewForm(false);
      } catch {
        toast.error("Failed to submit review");
      }
    },
    [chauffeurId, createReview],
  );

  const handleDeleteReview = useCallback(
    async (reviewId: number) => {
      try {
        await deleteReview({ chauffeurId, reviewId }).unwrap();
        toast.success("Review deleted");
      } catch {
        toast.error("Failed to delete review");
      }
    },
    [chauffeurId, deleteReview],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto" data-testid="chauffeur-detail-loading">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !chauffeur) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500 text-lg mb-4">Chauffeur not found</p>
        <Button
          onClick={() => router.push("/chauffeurs")}
          variant="outline"
        >
          Back to Chauffeurs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.push("/chauffeurs")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#65AA36] mb-6 transition-colors"
      >
        <CaretLeft size={16} weight="bold" />
        Back to Chauffeurs
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Photo */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
            <Image
              src={chauffeur.photo || FALLBACK_PHOTO}
              alt={chauffeur.user}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {chauffeur.user}
              </h1>
              {chauffeur.is_verified && (
                <ShieldCheck
                  size={22}
                  weight="fill"
                  className="text-green-600"
                />
              )}
            </div>

            <div className="flex items-center gap-4 justify-center sm:justify-start text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Star size={16} weight="fill" className="text-amber-400" />
                {chauffeur.average_rating} ({chauffeur.reviews_count} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} weight="duotone" className="text-gray-400" />
                {chauffeur.experience_years} years experience
              </span>
            </div>

            {chauffeur.bio && (
              <p className="text-gray-600 leading-relaxed">{chauffeur.bio}</p>
            )}

            <div className="flex items-center gap-4 mt-4 text-sm">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  chauffeur.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {chauffeur.is_active ? "Active" : "Inactive"}
              </span>
              <span className="text-gray-500">
                {chauffeur.total_trips} total trips
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
          {isAuthenticated && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-[#65AA36] hover:bg-[#5A9930] text-white"
              size="sm"
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Form (auth-gated) */}
        {showReviewForm && isAuthenticated && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <ReviewForm
              chauffeurId={chauffeurId}
              bookingId={1}
              onSubmit={handleCreateReview}
              onCancel={() => setShowReviewForm(false)}
              isSubmitting={isCreating}
            />
          </div>
        )}

        {/* Not authenticated message */}
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mb-4">
            Please{" "}
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-[#65AA36] hover:underline font-medium"
            >
              sign in
            </button>{" "}
            to leave a review.
          </p>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} weight="bold" className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {review.user}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        weight={star <= review.rating ? "fill" : "regular"}
                        className={
                          star <= review.rating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-sm text-gray-600 mt-2">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reviews pagination */}
        {(hasNextReviews || hasPreviousReviews) && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPreviousReviews}
              onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {reviewPage}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextReviews}
              onClick={() => setReviewPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
