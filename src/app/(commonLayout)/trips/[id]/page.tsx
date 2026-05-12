"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Camera,
  CalendarBlank,
  Car,
  CaretRight,
  CheckCircle,
  Clock,
  MapPin,
  Spinner,
  Upload,
  User,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import {
  useGetTripByIdQuery,
  useGetTripPhotosQuery,
  useUploadPrePhotosMutation,
  useUploadPostPhotosMutation,
} from "@/redux/api/tripsApi";
import { Button } from "@/components/ui/button";
import { formatApiError } from "@/utils/apiMessage";
import type { TripPhoto } from "@/types/api/trips";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const tripId = Number(params.id);

  const {
    data: trip,
    isLoading,
    isError,
  } = useGetTripByIdQuery(tripId, {
    skip: !isAuthenticated || Number.isNaN(tripId),
    // Poll while the trip can still change (driven by the worker or the user).
    pollingInterval: 15_000,
    refetchOnMountOrArgChange: true,
  });

  const { data: photoData } = useGetTripPhotosQuery(
    { id: tripId },
    { skip: !isAuthenticated || Number.isNaN(tripId) },
  );

  const [uploadPrePhotos, { isLoading: uploadingPre }] =
    useUploadPrePhotosMutation();
  const [uploadPostPhotos, { isLoading: uploadingPost }] =
    useUploadPostPhotosMutation();

  const prePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const postPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [caption, setCaption] = useState("");

  if (!isAuthenticated) {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#65AA36]" />
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Trip not found
          </h1>
          <p className="text-gray-600 mb-6">
            This trip doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push("/dashboard?tab=trips")}>
            Back to My Trips
          </Button>
        </div>
      </div>
    );
  }

  const photos: TripPhoto[] = photoData?.results ?? [];
  const prePhotos = photos.filter((p) => p.photo_type === "pre_trip");
  const postPhotos = photos.filter((p) => p.photo_type === "post_trip");

  const statusConfig =
    STATUS_CONFIG[trip.status] ?? {
      label: trip.status,
      color: "bg-gray-100 text-gray-700",
    };

  const isActive = trip.status === "active";
  const isSelfDrive = trip.drive_type === "self_drive";

  // Visibility for the two photo sections — they are independent:
  //
  //  PRE-TRIP card: visible whenever the trip is active for a self-drive
  //    booking, regardless of duration. Customer is encouraged to upload
  //    before driving, but the card stays so they can add more later.
  //
  //  POST-TRIP card: visible only on the trip's last day or after, so the
  //    customer isn't tempted to upload "after" photos mid-trip.
  //
  // For a 1-day self-drive booking both sections show on the same day —
  // that's correct behaviour (pre-drive → drive → post-drive).
  //
  // With-chauffeur trips don't get either card: the chauffeur handles the
  // car inspection, and damage liability isn't on the customer.
  //
  // `trip.end_date` is YYYY-MM-DD; compare as ISO strings (lex-orderable).
  const todayStr = new Date().toISOString().slice(0, 10);
  const isOnOrAfterEndDate = todayStr >= trip.end_date;

  const handlePrePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("photos", f));
    if (caption) formData.append("caption", caption);
    try {
      await uploadPrePhotos({ id: tripId, photos: formData }).unwrap();
      toast.success("Pre-trip photos uploaded");
      setCaption("");
    } catch (err) {
      toast.error(formatApiError(err, "Failed to upload pre-trip photos"));
    }
  };

  const handlePostPhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("photos", f));
    if (caption) formData.append("caption", caption);
    try {
      await uploadPostPhotos({ id: tripId, photos: formData }).unwrap();
      toast.success("Post-trip photos uploaded");
      setCaption("");
    } catch (err) {
      toast.error(formatApiError(err, "Failed to upload post-trip photos"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push("/dashboard?tab=trips")}
            className="hover:text-[#5E9D34] transition-colors"
          >
            My Trips
          </button>
          <CaretRight size={14} weight="bold" />
          <span className="text-gray-900 font-medium">
            Trip for {trip.booking_id}
          </span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {trip.car_name}
              </h1>
              <p className="text-gray-500">
                {trip.car_brand} {trip.car_model}
              </p>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CalendarBlank
                size={16}
                weight="duotone"
                className="text-[#5E9D34]"
              />
              Trip Dates
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Start</span>
                <span className="text-sm font-medium text-gray-900">
                  {trip.start_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">End</span>
                <span className="text-sm font-medium text-gray-900">
                  {trip.end_date}
                </span>
              </div>
              {trip.started_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Started at</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(trip.started_at).toLocaleString()}
                  </span>
                </div>
              )}
              {trip.completed_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed at</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(trip.completed_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Car size={16} weight="duotone" className="text-[#5E9D34]" />
              Drive Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Drive Type</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {trip.drive_type.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin size={16} weight="duotone" className="text-[#5E9D34]" />
              Locations
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Pickup</span>
                <p className="text-sm font-medium text-gray-900">
                  {trip.pickup_location_address || "—"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Drop-off</span>
                <p className="text-sm font-medium text-gray-900">
                  {trip.dropoff_location_address || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming notice */}
        {trip.status === "upcoming" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Clock
              size={20}
              weight="fill"
              className="text-blue-500 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Trip hasn&apos;t started yet
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                You&apos;ll be able to upload pre-trip photos once your trip
                starts on {trip.start_date}.
              </p>
            </div>
          </div>
        )}

        {/* Pre-trip photos — visible for the whole active self-drive trip,
            independent of post-trip. Customer can keep adding shots. */}
        {isActive && isSelfDrive && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Camera size={20} weight="duotone" className="text-[#5E9D34]" />
              Before driving — pre-trip photos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload photos of the car&apos;s condition <strong>before you start
              driving</strong>. This protects you from damage disputes.
              {prePhotos.length > 0 && (
                <span className="ml-1 text-[#5E9D34] font-medium">
                  ({prePhotos.length} uploaded)
                </span>
              )}
            </p>
            <input
              ref={prePhotoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePrePhotoUpload(e.target.files)}
            />
            <Button
              onClick={() => prePhotoInputRef.current?.click()}
              disabled={uploadingPre}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {uploadingPre ? (
                <Spinner size={16} className="mr-2 animate-spin" />
              ) : (
                <Upload size={16} weight="bold" className="mr-2" />
              )}
              Upload pre-trip photos
            </Button>
            {prePhotos.length > 0 && (
              <PhotoGrid photos={prePhotos} label="Uploaded pre-trip photos" />
            )}
          </div>
        )}

        {/* Post-trip photos — self-drive only, last day of trip onwards.
            Backend auto-completes the trip the day after end_date at noon. */}
        {isActive && isSelfDrive && isOnOrAfterEndDate && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Camera size={20} weight="duotone" className="text-[#5E9D34]" />
              After driving — post-trip photos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your trip is ending today. Upload photos of the car&apos;s
              condition <strong>after driving</strong> so we can finalise your
              booking.
              {postPhotos.length > 0 && (
                <span className="ml-1 text-[#5E9D34] font-medium">
                  ({postPhotos.length} uploaded)
                </span>
              )}
            </p>
            <input
              ref={postPhotoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePostPhotoUpload(e.target.files)}
            />
            <Button
              onClick={() => postPhotoInputRef.current?.click()}
              disabled={uploadingPost}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {uploadingPost ? (
                <Spinner size={16} className="mr-2 animate-spin" />
              ) : (
                <Upload size={16} weight="bold" className="mr-2" />
              )}
              Upload post-trip photos
            </Button>
            {postPhotos.length > 0 && (
              <PhotoGrid
                photos={postPhotos}
                label="Uploaded post-trip photos"
              />
            )}
          </div>
        )}

        {/* Completed: show photo galleries read-only */}
        {trip.status === "completed" && photos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle
                size={20}
                weight="duotone"
                className="text-[#5E9D34]"
              />
              Trip photos
            </h3>
            {prePhotos.length > 0 && (
              <PhotoGrid photos={prePhotos} label="Pre-trip" />
            )}
            {postPhotos.length > 0 && (
              <PhotoGrid photos={postPhotos} label="Post-trip" />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/bookings/${trip.id}`)}
          >
            <User size={16} weight="bold" className="mr-2" />
            View booking
          </Button>
        </div>

        {/* End-of-trip notice. The backend auto-completes the trip the day
            after end_date — customers don't end trips themselves. */}
        {isActive && isOnOrAfterEndDate && (
          <p className="mt-4 text-xs text-gray-500">
            Your trip will be marked as completed automatically once it ends.
            Make sure to upload your post-trip photos before then.
          </p>
        )}
      </div>
    </div>
  );
}

function PhotoGrid({
  photos,
  label,
}: {
  photos: TripPhoto[];
  label: string;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <a
            key={photo.id}
            href={photo.photo}
            target="_blank"
            rel="noreferrer"
            className="relative block aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-[#5E9D34] transition-colors"
          >
            <Image
              src={photo.photo}
              alt={photo.caption || "Trip photo"}
              fill
              sizes="200px"
              className="object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
