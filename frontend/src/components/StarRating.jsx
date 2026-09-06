
import React from 'react'
import { Star } from 'lucide-react'

const StarRating = ({
  rating = 0,
  onChange,
  size = 18,
  readonly = false,
}) => {
  const currentRating = Number(rating)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= currentRating

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className={`transition-all duration-200 ${
              readonly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                active
                  ? 'fill-black text-black'
                  : 'text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating

