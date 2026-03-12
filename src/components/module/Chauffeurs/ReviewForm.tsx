"use client";

import React, { useState } from "react";
import { Star, Spinner } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chauffeurReviewSchema,
  type ChauffeurReviewFormData,
} from "@/schemas/review";
import { Button } from "@/components/ui/button";

type Props = {
  chauffeurId: number;
  /** Pre-fill for edit mode */
  initialData?: {
    rating: number;
    review_text: string;
    reviewId: number;
  };
  /** Available booking IDs the user can review from */
  bookingId?: number;
  onSubmit: (data: ChauffeurReviewFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = any;

export default function ReviewForm({
  initialData,
  bookingId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(chauffeurReviewSchema) as any,
    defaultValues: {
      rating: initialData?.rating ?? 0,
      review_text: initialData?.review_text ?? "",
      booking_id: initialData?.reviewId ? 0 : bookingId ?? 0,
    },
  });

  const currentRating = watch("rating");

  const handleStarClick = (star: number) => {
    setValue("rating", star, { shouldValidate: true });
  };

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <h4 className="font-semibold text-gray-900">
        {initialData ? "Edit Your Review" : "Write a Review"}
      </h4>

      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5 focus:outline-none focus:ring-2 focus:ring-[#65AA36] rounded"
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              role="radio"
              aria-checked={currentRating === star}
            >
              <Star
                size={28}
                weight={
                  star <= (hoveredStar || currentRating) ? "fill" : "regular"
                }
                className={
                  star <= (hoveredStar || currentRating)
                    ? "text-amber-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-red-600 mt-1">{errors.rating?.message as string}</p>
        )}
      </div>

      {/* Hidden booking_id field */}
      <input type="hidden" {...register("booking_id", { valueAsNumber: true })} />

      {/* Review text */}
      <div>
        <label
          htmlFor="review_text"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Review (optional)
        </label>
        <textarea
          id="review_text"
          {...register("review_text")}
          rows={4}
          placeholder="Share your experience with this chauffeur..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#65AA36] focus:ring-1 focus:ring-[#65AA36] outline-none transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#65AA36] hover:bg-[#5A9930] text-white"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size={16} className="animate-spin" />
              Submitting...
            </span>
          ) : initialData ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
