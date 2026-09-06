
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

export default function WatchDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()

  const [watch, setWatch] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchWatch()
    fetchReviews()
  }, [id])

  const fetchWatch = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/watches/${id}`)
      const currentWatch = res.data.watch

      setWatch(currentWatch)
      setActiveImage(0)

      const relatedRes = await axiosInstance.get(
        `/watches?brand=${currentWatch.brand}`
      )

      const filtered = relatedRes.data.watches
        .filter((w) => w._id !== id)
        .slice(0, 4)

      setRelated(filtered)
    } catch (err) {
      toast.error('Failed to load watch')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/reviews/${id}`)
      setReviews(res.data.reviews)
    } catch (err) {
      console.error(err)
    }
  }

  // ============================================
  // ADD TO CART
  // LOGIN REQUIRED
  // ============================================

  const handleAddToCart = () => {
    const added = addItem({
      id: watch._id,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      originalPrice: watch.price,
      discountPrice: watch.discountPrice,
      stock: watch.stock,
      img: watch.images?.[0]?.url || '',
    })

    // Success toast only if item was actually added
    if (added) {
      toast.success(`${watch.name} added to cart!`)
    }
  }

  // ============================================
  // WISHLIST
  // ============================================

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist')
      return
    }

    try {
      if (wishlisted) {
        await axiosInstance.delete(`/wishlist/${watch._id}`)
        setWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        await axiosInstance.post(`/wishlist/${watch._id}`)
        setWishlisted(true)
        toast.success('Added to wishlist!')
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  // ============================================
  // REVIEW SUBMIT
  // ============================================

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      toast.error('Please login to write a review')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setSubmitting(true)

    try {
      await axiosInstance.post(`/reviews/${id}`, {
        rating,
        comment,
      })

      toast.success('Review submitted!')

      setRating(5)
      setComment('')

      fetchReviews()
      fetchWatch()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit review'

      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================
  // RENDER STARS
  // ============================================

  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(value)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-200 fill-gray-200'
        }`}
      />
    ))
  }

  // ============================================
  // DISPLAY PRICE
  // ============================================

  const getDisplayPrice = () => {
    if (
      watch.discountPrice &&
      watch.discountPrice > 0 &&
      watch.discountPrice < watch.price
    ) {
      return watch.discountPrice
    }

    return watch.price
  }

  // ============================================
  // DISCOUNT PERCENTAGE
  // ============================================

  const getDiscountPercentage = () => {
    if (
      watch.discountPrice &&
      watch.discountPrice > 0 &&
      watch.discountPrice < watch.price
    ) {
      return Math.round(
        ((watch.price - watch.discountPrice) /
          watch.price) *
          100
      )
    }

    return 0
  }

  // ============================================
  // FORMAT SPECIFICATION NAME
  // ============================================

  const formatSpecName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase())
  }

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="w-32 h-5 bg-gray-200 rounded-full animate-pulse mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="bg-gray-100 rounded-[2rem] h-[430px] sm:h-[550px] animate-pulse" />

            <div className="space-y-5">
              <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-4/5 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/2 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse" />

              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
              </div>

              <div className="h-14 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // WATCH NOT FOUND
  // ============================================

  if (!watch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <ShoppingBag
            className="text-gray-400"
            size={30}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Watch not found
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          The product you're looking for doesn't exist.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
      </div>
    )
  }

  const images =
    watch.images?.filter((image) => image?.url) || []

  const currentImage =
    images[activeImage]?.url || ''

  const discountPercentage =
    getDiscountPercentage()

  const displayPrice =
    getDisplayPrice()

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 overflow-hidden">

      {/* ========================================
          BACK TO SHOP
      ======================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-7">
        <Link
          to="/shop"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />

          Back to Shop
        </Link>
      </div>

      {/* ========================================
          PRODUCT SECTION
      ======================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">

          {/* ====================================
              PRODUCT IMAGE
          ==================================== */}

          <section className="lg:sticky lg:top-24">

            <div className="relative">

              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gray-200/50 rounded-full blur-3xl" />

              <div className="group relative h-[400px] sm:h-[540px] bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center">

                <div className="absolute top-5 left-5 z-10 flex items-center gap-2">

                  {watch.tag && (
                    <span className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles size={11} />
                      {watch.tag}
                    </span>
                  )}

                  {discountPercentage > 0 && (
                    <span className="bg-white border border-gray-200 text-gray-900 px-3 py-1.5 rounded-full text-[10px] font-bold">
                      -{discountPercentage}%
                    </span>
                  )}

                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-80" />

                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={watch.name}
                    className="relative z-[1] w-[78%] h-[78%] object-contain transition-all duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative z-[1] text-center text-gray-300">
                    <ShoppingBag
                      size={65}
                      className="mx-auto mb-3"
                    />

                    <p className="text-sm">
                      No image available
                    </p>
                  </div>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-lg">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">
                    {watch.brand}
                  </p>
                </div>

              </div>

              {/* ==================================
                  IMAGE THUMBNAILS
              ================================== */}

              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">

                  {images.map((image, index) => (
                    <button
                      key={image.publicId || index}
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border overflow-hidden flex items-center justify-center transition-all duration-300 ${
                        activeImage === index
                          ? 'border-black shadow-md scale-[1.03]'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${watch.name} ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}

                </div>
              )}

            </div>

          </section>

          {/* ====================================
              PRODUCT DETAILS
          ==================================== */}

          <section className="lg:pt-4">

            <div className="flex items-center gap-3 mb-4">

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                {watch.brand}
              </span>

              <span className="w-1 h-1 rounded-full bg-gray-300" />

              <span className="text-xs uppercase tracking-widest text-gray-400">
                {watch.category || 'Luxury Collection'}
              </span>

            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-gray-950"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {watch.name}
            </h1>

            {/* ==================================
                RATING
            ================================== */}

            {watch.numReviews > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-5">

                <div className="flex items-center gap-1">
                  {renderStars(watch.rating)}
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {Number(watch.rating).toFixed(1)}
                </span>

                <span className="text-sm text-gray-400">
                  ({watch.numReviews} reviews)
                </span>

              </div>
            )}

            {/* ==================================
                PRICE
            ================================== */}

            <div className="flex items-end flex-wrap gap-3 mt-7">

              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
                ₹
                {Number(displayPrice).toLocaleString(
                  'en-IN'
                )}
              </span>

              {discountPercentage > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-1">
                    ₹
                    {Number(
                      watch.price
                    ).toLocaleString('en-IN')}
                  </span>

                  <span className="mb-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Save {discountPercentage}%
                  </span>
                </>
              )}

            </div>

            {/* ==================================
                DESCRIPTION
            ================================== */}

            <p className="mt-5 text-gray-500 leading-7 text-sm sm:text-base max-w-xl">
              {watch.description ||
                'A timeless expression of craftsmanship, precision and sophisticated design.'}
            </p>

            {/* ==================================
                SPECIFICATIONS
            ================================== */}

            {watch.specs &&
              Object.values(watch.specs).some(Boolean) && (
                <div className="mt-8">

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
                      Specifications
                    </h2>

                    <div className="h-px bg-gray-200 flex-1 ml-5" />

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    {Object.entries(
                      watch.specs
                    ).map(
                      ([key, value], index) =>
                        value && (
                          <div
                            key={key}
                            className="group bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                              animation: `fadeUp .45s ease-out ${
                                index * 0.06
                              }s both`,
                            }}
                          >
                            <p className="text-[9px] text-gray-400 uppercase tracking-[0.18em] mb-2">
                              {formatSpecName(key)}
                            </p>

                            <p className="text-sm font-semibold text-gray-900">
                              {value}
                            </p>
                          </div>
                        )
                    )}

                  </div>

                </div>
              )}

            {/* ==================================
                STOCK
            ================================== */}

            <div className="mt-7 flex items-center gap-3">

              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  watch.stock > 0
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              />

              <p
                className={`text-sm font-semibold ${
                  watch.stock > 0
                    ? 'text-emerald-600'
                    : 'text-red-500'
                }`}
              >
                {watch.stock > 0
                  ? `In Stock · ${watch.stock} available`
                  : 'Out of Stock'}
              </p>

            </div>

            {/* ==================================
                ADD TO CART + WISHLIST
            ================================== */}

            <div className="flex items-center gap-3 mt-6">

              <button
                onClick={handleAddToCart}
                disabled={watch.stock === 0}
                className={`group relative flex-1 overflow-hidden flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold transition-all duration-300 ${
                  watch.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl'
                }`}
              >

                {watch.stock > 0 && (
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}

                <ShoppingBag
                  size={18}
                  className="relative"
                />

                <span className="relative">
                  {watch.stock === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </span>

              </button>

              <button
                onClick={handleWishlist}
                aria-label="Toggle wishlist"
                className={`w-14 h-14 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  wishlisted
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                }`}
              >

                <Heart
                  size={21}
                  className={`transition-transform duration-300 ${
                    wishlisted
                      ? 'fill-white scale-110'
                      : ''
                  }`}
                />

              </button>

            </div>

            {/* ==================================
                SERVICE FEATURES
            ================================== */}

            <div className="grid grid-cols-3 border-y border-gray-100 mt-8 py-5">

              <div className="flex flex-col items-center text-center gap-2 border-r border-gray-100">
                <ShieldCheck
                  size={19}
                  className="text-gray-700"
                />

                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  Authentic
                </p>
              </div>

              <div className="flex flex-col items-center text-center gap-2 border-r border-gray-100">
                <Truck
                  size={19}
                  className="text-gray-700"
                />

                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  Secure Delivery
                </p>
              </div>

              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw
                  size={19}
                  className="text-gray-700"
                />

                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  Easy Returns
                </p>
              </div>

            </div>

          </section>

        </div>

      </main>

      {/* ========================================
          REVIEWS
      ======================================== */}

      <section className="border-t border-gray-100 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="max-w-2xl mb-8">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
              Community
            </p>

            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-950"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Customer Reviews

              {reviews.length > 0 && (
                <span className="text-gray-300 text-xl ml-2">
                  ({reviews.length})
                </span>
              )}

            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Discover what other watch enthusiasts think.
            </p>

          </div>

          {/* ==================================
              REVIEW FORM
          ================================== */}

          {isLoggedIn && (
            <form
              onSubmit={handleReviewSubmit}
              className="relative overflow-hidden bg-[#fafafa] rounded-3xl border border-gray-100 p-6 sm:p-8 mb-8"
            >

              <div className="absolute -right-20 -top-20 w-40 h-40 bg-gray-200/40 rounded-full blur-3xl" />

              <div className="relative">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                    <Star
                      size={18}
                      fill="white"
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Share your experience
                    </h3>

                    <p className="text-xs text-gray-400">
                      Your review helps other customers.
                    </p>

                  </div>

                </div>

                {/* Rating */}

                <div className="flex items-center gap-1 mb-5">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-all duration-200 hover:scale-110 ${
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 fill-gray-300'
                          }`}
                        />
                      </button>
                    )
                  )}

                  <span className="ml-2 text-sm font-semibold text-gray-500">
                    {rating}/5
                  </span>

                </div>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Tell us about your experience with this watch..."
                  rows={4}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition resize-none"
                />

                <div className="flex justify-end mt-4">

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-7 py-3 rounded-full text-sm font-semibold transition-all ${
                      submitting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Review'}
                  </button>

                </div>

              </div>

            </form>
          )}

          {/* ==================================
              REVIEWS LIST
          ================================== */}

          {reviews.length === 0 ? (

            <div className="bg-[#fafafa] rounded-3xl border border-gray-100 py-14 text-center">

              <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto">

                <Star
                  className="text-gray-300"
                  size={23}
                />

              </div>

              <p className="text-sm text-gray-500 mt-4">
                No reviews yet.
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Be the first to share your experience.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {reviews.map(
                (review, index) => (
                  <div
                    key={review._id}
                    className="group bg-[#fafafa] border border-gray-100 rounded-3xl p-6 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
                    style={{
                      animation: `fadeUp .5s ease-out ${
                        index * 0.08
                      }s both`,
                    }}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-1">
                        {renderStars(
                          review.rating
                        )}
                      </div>

                      <span className="text-[10px] text-gray-400">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          'en-IN'
                        )}
                      </span>

                    </div>

                    <p className="text-sm text-gray-600 leading-7 mt-5">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200">

                      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                        {(review.userName || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        {review.userName ||
                          'Customer'}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* ========================================
          RELATED WATCHES
      ======================================== */}

      {related.length > 0 && (
        <section className="bg-[#fafafa] border-t border-gray-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

            <div className="flex items-end justify-between mb-8">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                  You may also like
                </p>

                <h2
                  className="text-3xl sm:text-4xl font-bold text-gray-950"
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                  }}
                >
                  More from {watch.brand}
                </h2>

              </div>

              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black transition"
              >
                Explore All

                <ArrowLeft
                  size={15}
                  className="rotate-180"
                />
              </Link>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

              {related.map(
                (w, index) => (
                  <Link
                    to={`/watches/${w._id}`}
                    key={w._id}
                    className="group"
                    style={{
                      animation: `fadeUp .5s ease-out ${
                        index * 0.08
                      }s both`,
                    }}
                  >

                    <div className="relative bg-white rounded-3xl border border-gray-100 h-48 sm:h-64 flex items-center justify-center p-5 overflow-hidden group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">

                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

                      {w.images?.[0]?.url ? (
                        <img
                          src={w.images[0].url}
                          alt={w.name}
                          className="relative z-[1] w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <ShoppingBag
                          size={38}
                          className="relative z-[1] text-gray-300"
                        />
                      )}

                      {w.tag && (
                        <span className="absolute top-3 left-3 z-10 bg-black text-white px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                          {w.tag}
                        </span>
                      )}

                      <div className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                        <ArrowLeft
                          size={14}
                          className="rotate-180"
                        />

                      </div>

                    </div>

                    <div className="px-1 mt-4">

                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {w.brand}
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1 line-clamp-1">
                        {w.name}
                      </p>

                      <p className="text-sm font-bold text-gray-800 mt-1">
                        ₹
                        {Number(
                          w.discountPrice &&
                            w.discountPrice > 0 &&
                            w.discountPrice <
                              w.price
                            ? w.discountPrice
                            : w.price
                        ).toLocaleString(
                          'en-IN'
                        )}
                      </p>

                    </div>

                  </Link>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* ========================================
          ANIMATION
      ======================================== */}

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  )
}

