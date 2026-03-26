"use client";

import { useState } from "react";

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hover, setHover] = useState(0);

  const sizeClass = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" }[size];

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`${sizeClass} transition-transform ${
              readonly ? "cursor-default" : "cursor-pointer active:scale-90"
            } ${filled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
