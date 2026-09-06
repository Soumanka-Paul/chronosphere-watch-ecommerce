
import React from 'react'
import { Heart } from 'lucide-react'

const WishlistButton = ({
  isWishlisted = false,
  onClick,
  size = 18,
}) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onClick?.(e)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
        isWishlisted
          ? 'bg-black text-white'
          : 'bg-white/95 text-gray-600 hover:bg-black hover:text-white'
      }`}
      aria-label={
        isWishlisted
          ? 'Remove from wishlist'
          : 'Add to wishlist'
      }
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          isWishlisted ? 'fill-current' : ''
        }`}
      />
    </button>
  )
}

export default WishlistButton

