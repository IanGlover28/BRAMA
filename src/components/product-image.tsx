"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImage({ 
  src, 
  alt 
}: { 
  src: string; 
  alt: string; 
}) {
  const [imageError, setImageError] = useState(false);

  // Use placeholder if error occurs or if src is invalid
  const imageSrc = imageError || !src ? "/placeholder.png" : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-contain"
      priority
      onError={() => setImageError(true)}
      unoptimized
    />
  );
}