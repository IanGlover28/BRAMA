import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export default function StarRating({ value, onChange, size = 18 }: StarRatingProps) {
  const interactive = !!onChange;
  return (
    <div className={interactive ? "flex items-center gap-1" : "flex items-center gap-0.5"}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
              className="transition hover:scale-110"
            >
              <Star size={size} className={filled ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
            </button>
          );
        }
        return (
          <Star
            key={star}
            size={size}
            className={filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        );
      })}
    </div>
  );
}