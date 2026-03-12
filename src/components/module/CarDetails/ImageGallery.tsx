/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
// components/car/ImageGallery.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  images: string[];
}

export function CarImageGallery({ name, images }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => setActiveImage(0), [images]);

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/10]">
        <motion.img
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={images[activeImage]}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(idx)}
            className={cn(
              "aspect-[16/10] overflow-hidden rounded-lg border-2 transition-all",
              activeImage === idx
                ? "border-[#5E9D34] ring-2 ring-[#5E9D34]/20"
                : "border-transparent hover:border-gray-300",
            )}
          >
            <img
              src={img}
              alt={`View ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
