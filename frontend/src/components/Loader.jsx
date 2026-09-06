
import React from 'react'

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />

        <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin" />

        <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
          <span
            className="text-white text-[8px] font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            C
          </span>
        </div>
      </div>
    </div>
  )
}

export default Loader

