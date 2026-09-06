
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  Trash2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import axiosInstance from '../utils/axios'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { isLoggedIn } = useAuth()
  const { addItem } = useCart()

  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [movingId, setMovingId] = useState(null)

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn])

  const fetchWishlist = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/wishlist')

      setWishlist(res.data.watches || [])
    } catch (error) {
      console.error('Fetch wishlist error:', error)

      toast.error(
        error.response?.data?.message ||
          'Failed to load wishlist'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (watchId) => {
    try {
      setRemovingId(watchId)

      await axiosInstance.delete(
        `/wishlist/${watchId}`
      )

      setWishlist((prev) =>
        prev.filter((watch) => watch._id !== watchId)
      )

      toast.success('Removed from wishlist')
    } catch (error) {
      console.error(
        'Remove wishlist error:',
        error
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to remove from wishlist'
      )
    } finally {
      setRemovingId(null)
    }
  }

  const handleMoveToCart = async (watch) => {
    try {
      setMovingId(watch._id)

      addItem({
        id: watch._id,
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        discountPrice: watch.discountPrice,
        originalPrice: watch.price,
        img: watch.images?.[0]?.url,
      })

      await axiosInstance.delete(
        `/wishlist/${watch._id}`
      )

      setWishlist((prev) =>
        prev.filter(
          (item) => item._id !== watch._id
        )
      )

      toast.success(
        `${watch.name} moved to cart!`
      )
    } catch (error) {
      console.error(
        'Move to cart error:',
        error
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to move item to cart'
      )
    } finally {
      setMovingId(null)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Heart className="h-8 w-8 text-gray-300" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              ChronoSphere
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Please login first
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              Sign in to save your favorite timepieces
              and access them anytime.
            </p>

            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Login to Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f6]">
        <section className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="h-3 w-28 bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-10 w-56 bg-white/10 rounded animate-pulse" />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
              >
                <div className="h-56 bg-gray-100 animate-pulse" />

                <div className="p-5">
                  <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse mb-3" />
                  <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-3" />
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-5" />
                  <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse" />

              <div className="relative w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-300" />
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              Saved Collection
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Your wishlist is empty
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              Discover a timepiece you love and save it
              here for later.
            </p>

            <Link
              to="/shop"
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Explore Watches
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 fill-white" />

                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Saved Collection
                </p>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                My Wishlist
              </h1>

              <p className="text-sm text-white/50 mt-3 max-w-lg">
                Your personal selection of watches worth
                keeping an eye on.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
                <p className="text-[9px] uppercase tracking-wider text-white/40">
                  Saved
                </p>

                <p className="text-lg font-bold mt-0.5">
                  {wishlist.length}
                </p>
              </div>

              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-2 bg-white text-black rounded-full px-5 py-3 text-xs font-semibold hover:bg-gray-100 transition-all"
              >
                Discover More
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Your Favorites
            </p>

            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 mt-1"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Saved Timepieces
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            Your wishlist is synced to your account
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((watch) => {
            const originalPrice =
              Number(
                watch.originalPrice ??
                  watch.price ??
                  0
              )

            const discountPrice =
              watch.discountPrice &&
              Number(watch.discountPrice) > 0 &&
              Number(watch.discountPrice) <
                originalPrice
                ? Number(watch.discountPrice)
                : null

            const sellingPrice =
              discountPrice ?? originalPrice

            const hasDiscount =
              discountPrice !== null

            const discountPercentage = hasDiscount
              ? Math.round(
                  ((originalPrice -
                    sellingPrice) /
                    originalPrice) *
                    100
                )
              : 0

            return (
              <div
                key={watch._id}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-56 sm:h-64 bg-gray-50 overflow-hidden">
                  {/* BADGE */}
                  {watch.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 bg-black text-white px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-2.5 h-2.5" />
                        {watch.tag}
                      </span>
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                      {!watch.tag && (
                        <span className="bg-black text-white px-2.5 py-1.5 rounded-full text-[9px] font-bold">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      handleRemove(watch._id)
                    }
                    disabled={
                      removingId === watch._id
                    }
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {removingId === watch._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    )}
                  </button>

                  {/* IMAGE */}
                  <Link
                    to={`/watches/${watch._id}`}
                    className="absolute inset-0 flex items-center justify-center p-6"
                  >
                    <img
                      src={watch.images?.[0]?.url}
                      alt={watch.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* BOTTOM IMAGE GRADIENT */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                {/* INFO */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400">
                      {watch.brand}
                    </p>

                    <Link
                      to={`/watches/${watch._id}`}
                      className="block text-sm sm:text-base font-semibold text-gray-900 mt-1 hover:text-gray-600 transition-colors line-clamp-1"
                    >
                      {watch.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        ₹
                        {sellingPrice.toLocaleString(
                          'en-IN'
                        )}
                      </span>

                      {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹
                          {originalPrice.toLocaleString(
                            'en-IN'
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CART */}
                  <button
                    onClick={() =>
                      handleMoveToCart(watch)
                    }
                    disabled={
                      movingId === watch._id
                    }
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-black text-white text-[11px] sm:text-xs font-bold py-3.5 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {movingId === watch._id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Moving...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-10 relative overflow-hidden bg-black text-white rounded-3xl p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Keep Exploring
                </p>
              </div>

              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                Find your next timepiece
              </h3>

              <p className="text-xs text-white/40 mt-2">
                Discover more watches for your collection.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-6 py-3.5 text-xs font-bold hover:bg-gray-100 transition-all w-fit"
            >
              Browse Collection
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

