"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
};

/**
 * Star rating — pass `onChange` to make it an interactive input (used in
 * the review submission form), or omit it for a read-only display (used
 * on review cards and the average-rating summary).
 */
export function StarRating({ value, onChange, size = 20, readOnly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !readOnly && !!onChange;
  const displayValue = hoverValue ?? value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={isInteractive ? "radiogroup" : undefined}
      aria-label={isInteractive ? "Rating" : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;

        if (!isInteractive) {
          return (
            <svg
              key={star}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#f59e0b" : "none"}
              stroke="#f59e0b"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={value === star}
            className="p-0.5"
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}