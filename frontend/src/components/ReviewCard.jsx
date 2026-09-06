
import React from 'react'
import { Star, User } from 'lucide-react'

const ReviewCard = ({ review }) => {
  const rating = Number(review?.rating || 0)

  const formattedDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {review?.userName || 'Anonymous'}
            </h4>

            {formattedDate && (
              <p className="text-xs text-gray-400 mt-0.5">
                {formattedDate}
              </p>
            )}
          </div>

        </div>


        {/* Rating */}

        <div className="flex items-center gap-0.5">

          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? 'fill-black text-black'
                  : 'text-gray-300'
              }`}
            />
          ))}

        </div>

      </div>


      {/* Review */}

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {review?.comment || 'No review comment available.'}
      </p>

    </div>
  )
}

export default ReviewCard
