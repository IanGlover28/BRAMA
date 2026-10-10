"use client";

import Image from "next/image";

export default function ImageWithFallback({
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <Image
      {...props}
      alt={alt}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.png";
      }}
    />
  );
}