
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ShoppingBag,
  Heart,
  Star,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  PackageCheck,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

const brands = [
  'All',
  'Rolex',
  'Omega',
  'Audemars Piguet',
  'Hublot',
  'Patek Philippe',
  'Tag Heuer',
  'IWC',
  'Jaeger-LeCoultre',
]

export default function Shop() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [wishlistIds, setWishlistIds] = useState([])

  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    fetchWatches()
  }, [selectedBrand, search])

  const fetchWatches = async () => {
    try {
      setLoading(true)

      let query = ''

      if (selectedBrand !== 'All') {
        query += `brand=${encodeURIComponent(selectedBrand)}&`
      }

      if (search) {
        query += `search=${encodeURIComponent(search)}`
      }

      const res = await axiosInstance.get(`/watches?${query}`)

      setWatches(res.data.watches || [])
    } catch (err) {
      console.error('Fetch watches error:', err)

      toast.error(
        err.response?.data?.message ||
          'Failed to load watches'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist()
    } else {
      setWishlistIds([])
    }
  }, [isLoggedIn])

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/wishlist')

      const ids = (res.data.watches || []).map(
        (watch) => watch._id
      )

      setWishlistIds(ids)
    } catch (error) {
      console.error('Fetch wishlist error:', error)
    }
  }

  const handleWishlist = async (e, watch) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error('Please login to use wishlist')
      return
    }

    const alreadyAdded = wishlistIds.includes(watch._id)

    try {
      if (alreadyAdded) {
        await axiosInstance.delete(
          `/wishlist/${watch._id}`
        )

        setWishlistIds((prev) =>
          prev.filter((id) => id !== watch._id)
        )

        toast.success('Removed from wishlist')
      } else {
        await axiosInstance.post(
          `/wishlist/${watch._id}`
        )

        setWishlistIds((prev) => [
          ...prev,
          watch._id,
        ])

        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Wishlist error:', error)

      toast.error(
        error.response?.data?.message ||
          'Something went wrong'
      )
    }
  }

  const handleAddToCart = (e, watch) => {
    e.preventDefault()
    e.stopPropagation()

    if (Number(watch.stock || 0) <= 0) {
      toast.error('This watch is currently out of stock')
      return
    }

    const sellingPrice =
      watch.discountPrice &&
      Number(watch.discountPrice) > 0
        ? Number(watch.discountPrice)
        : Number(watch.price)

    addItem({
      id: watch._id,
      name: watch.name,
      brand: watch.brand,
      price: sellingPrice,
      originalPrice: Number(watch.price),
      discountPrice:
        watch.discountPrice &&
        Number(watch.discountPrice) > 0
          ? Number(watch.discountPrice)
          : null,
      img: watch.images?.[0]?.url || '',
    })

    toast.success(`${watch.name} added to cart!`)
  }

  const getDiscountPercentage = (watch) => {
    if (
      !watch.discountPrice ||
      Number(watch.discountPrice) <= 0 ||
      Number(watch.discountPrice) >= Number(watch.price)
    ) {
      return 0
    }

    return Math.round(
      ((Number(watch.price) -
        Number(watch.discountPrice)) /
        Number(watch.price)) *
        100
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" />

        <div className="absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-white/[0.04] blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-14 sm:py-18 md:py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-gray-400 mb-5"
            style={{
              animation: 'fadeUp 0.6s ease both',
            }}
          >
            <Sparkles className="h-3 w-3" />
            The ChronoSphere Collection
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              animation: 'fadeUp 0.7s ease 0.08s both',
            }}
          >
            Shop All Watches
          </h1>

          <p
            className="text-gray-400 text-xs sm:text-sm md:text-base max-w-lg mx-auto mt-5 leading-6"
            style={{
              animation: 'fadeUp 0.7s ease 0.16s both',
            }}
          >
            Discover timeless craftsmanship, iconic designs,
            and exceptional watches curated for those who
            appreciate precision.
          </p>

          <div
            className="flex items-center justify-center gap-6 sm:gap-10 mt-8 text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider"
            style={{
              animation: 'fadeUp 0.7s ease 0.24s both',
            }}
          >
            <span>{watches.length} Watches</span>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span>Premium Collection</span>
            <span className="h-1 w-1 rounded-full bg-gray-600 hidden sm:block" />
            <span className="hidden sm:block">Worldwide Style</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search by watch name or brand..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />

              <span className="text-[10px] uppercase tracking-[0.18em]">
                Filter by Brand
              </span>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setSelectedBrand(brand)
                }
                className={`relative px-4 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-semibold border whitespace-nowrap transition-all duration-300 ${
                  selectedBrand === brand
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              Collection
            </p>

            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 mt-1"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {selectedBrand === 'All'
                ? 'All Watches'
                : selectedBrand}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Showing
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {watches.length}{' '}
              {watches.length === 1
                ? 'watch'
                : 'watches'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
              >
                <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-[220px] sm:h-[300px] lg:h-[340px]" />

                <div className="pt-4 px-1">
                  <div className="bg-gray-200 rounded h-2.5 w-1/3 mb-2" />
                  <div className="bg-gray-200 rounded h-3.5 w-4/5 mb-2" />
                  <div className="bg-gray-200 rounded h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : watches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 py-20 sm:py-28 text-center shadow-sm">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <Search className="h-6 w-6 text-gray-300" />
            </div>

            <h3
              className="text-xl font-bold text-gray-900"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              No watches found
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Try another search or explore our full
              collection.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setSelectedBrand('All')
              }}
              className="mt-6 inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-all"
            >
              View All Watches
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 md:grid-cols-4">
            {watches.map((watch, index) => {
              const hasDiscount =
                watch.discountPrice &&
                Number(watch.discountPrice) > 0 &&
                Number(watch.discountPrice) <
                  Number(watch.price)

              const sellingPrice = hasDiscount
                ? Number(watch.discountPrice)
                : Number(watch.price)

              const discountPercentage =
                getDiscountPercentage(watch)

              const isOutOfStock =
                Number(watch.stock || 0) <= 0

              const isLowStock =
                Number(watch.stock || 0) > 0 &&
                Number(watch.stock || 0) <= 3

              const isWishlisted =
                wishlistIds.includes(watch._id)

              return (
                <Link
                  to={`/watches/${watch._id}`}
                  key={watch._id}
                  className="group block"
                  style={{
                    animation: `fadeUp 0.5s ease ${
                      index * 0.05
                    }s both`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f7f7f5] border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <div className="relative h-[220px] sm:h-[300px] lg:h-[340px] flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-gray-200/50" />

                      {watch.tag && !hasDiscount && (
                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black text-white text-[7px] sm:text-[9px] font-semibold px-2.5 py-1.5 sm:px-3 rounded-full uppercase tracking-[0.12em] shadow-lg">
                          {watch.tag}
                        </span>
                      )}

                      {hasDiscount && (
                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-white text-black text-[8px] sm:text-[9px] font-bold px-2.5 py-1.5 sm:px-3 rounded-full shadow-md uppercase tracking-[0.08em]">
                          -{discountPercentage}%
                        </span>
                      )}

                      <button
                        onClick={(e) =>
                          handleWishlist(e, watch)
                        }
                        className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 ${
                          isWishlisted
                            ? 'opacity-100'
                            : 'opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
                        }`}
                        aria-label={
                          isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                        }
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-[17px] sm:h-[17px] transition-all ${
                            isWishlisted
                              ? 'fill-black text-black scale-110'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>

                      {watch.images?.[0]?.url ? (
                        <img
                          src={watch.images[0].url}
                          alt={watch.name}
                          loading="lazy"
                          className="relative z-10 w-[82%] h-[78%] sm:w-[82%] sm:h-[82%] object-contain transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1"
                        />
                      ) : (
                        <div className="relative z-10 flex flex-col items-center gap-2 text-gray-300">
                          <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10" />
                          <p className="text-[10px] sm:text-xs">
                            No image
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 via-black/5 to-transparent pointer-events-none" />

                      {isLowStock && !isOutOfStock && (
                        <span className="absolute bottom-4 left-4 z-20 text-[8px] sm:text-[9px] font-semibold text-red-600 bg-white/95 px-2.5 py-1.5 rounded-full shadow-sm">
                          Only {watch.stock} left
                        </span>
                      )}

                      <button
                        onClick={(e) =>
                          handleAddToCart(e, watch)
                        }
                        disabled={isOutOfStock}
                        className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-20 bg-black text-white text-[10px] sm:text-[11px] font-semibold tracking-wide px-4 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 shadow-xl whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isOutOfStock ? (
                          <>
                            <PackageCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-5 px-0.5 sm:px-1">
                    <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-[0.16em] sm:tracking-[0.22em] font-semibold truncate">
                      {watch.brand}
                    </p>

                    <div className="flex items-start justify-between gap-2 mt-1">
                      <h3 className="text-[12px] sm:text-[15px] font-semibold text-gray-900 leading-4 sm:leading-5 line-clamp-2 group-hover:text-gray-500 transition-colors">
                        {watch.name}
                      </h3>

                      {Number(watch.rating || 0) > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black text-black" />

                          <span className="text-[9px] sm:text-[11px] font-medium text-gray-600">
                            {Number(
                              watch.rating
                            ).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                      <span className="text-[13px] sm:text-[15px] font-bold text-gray-950">
                        ₹
                        {sellingPrice.toLocaleString(
                          'en-IN'
                        )}
                      </span>

                      {hasDiscount && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          ₹
                          {Number(
                            watch.price
                          ).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {Number(watch.numReviews || 0) > 0 && (
                      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">
                        {watch.numReviews}{' '}
                        {watch.numReviews === 1
                          ? 'review'
                          : 'reviews'}
                      </p>
                    )}

                    {isOutOfStock && (
                      <p className="text-[9px] sm:text-[10px] text-red-500 font-medium mt-1">
                        Currently unavailable
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <section className="mt-14 sm:mt-20 bg-black text-white rounded-3xl overflow-hidden relative">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 p-7 sm:p-9 md:p-10">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <PackageCheck className="h-5 w-5 text-gray-300" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Authentic Watches
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Carefully selected collection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <TruckIcon className="h-5 w-5 text-gray-300" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Free Delivery
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Fast & secure shipping
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <Heart className="h-5 w-5 text-gray-300" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Made for Watch Lovers
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Find your perfect timepiece
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

function TruckIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M14 8h4l4 4v5h-3" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  )
}
