
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  Truck,
  RefreshCw,
  Headphones,
  ShoppingBag,
  Sparkles,
  Star,
  Heart,
  Clock3,
} from 'lucide-react'
import axiosInstance from '../utils/axios'
import toast from 'react-hot-toast'

const features = [
  {
    icon: Shield,
    title: 'Authenticity Guaranteed',
    desc: 'Every watch comes with a certificate of authenticity.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Free insured delivery across India on all orders.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: RefreshCw,
    title: '30 Day Returns',
    desc: 'Return within 30 days, no questions asked.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our watch experts are available around the clock.',
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function Home() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedWatches()
  }, [])

  const fetchFeaturedWatches = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/watches')

      setWatches(
        (res.data.watches || []).slice(0, 8)
      )
    } catch (error) {
      console.error(
        'Fetch featured watches error:',
        error
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to load watches'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white overflow-hidden">
      <section className="relative bg-[#070707] text-white w-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.10),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.08),transparent_32%)]" />

        <div className="absolute top-24 left-[8%] w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
        <div className="absolute top-40 right-[13%] w-1.5 h-1.5 rounded-full bg-purple-300 animate-ping" />
        <div className="absolute bottom-32 left-[22%] w-1 h-1 rounded-full bg-blue-300 animate-pulse" />
        <div className="absolute bottom-40 right-[25%] w-1 h-1 rounded-full bg-white/60 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-7"
              style={{
                animation: 'fadeUp 0.7s ease both',
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />

              <span className="text-[9px] sm:text-xs uppercase tracking-[0.22em] text-gray-300">
                Welcome to ChronoSphere
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.04] tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                animation: 'fadeUp 0.8s ease 0.08s both',
              }}
            >
              Time is the

              <span className="block italic bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                ultimate luxury.
              </span>
            </h1>

            <p
              className="mt-7 text-sm sm:text-base text-gray-400 max-w-xl leading-7"
              style={{
                animation: 'fadeUp 0.8s ease 0.16s both',
              }}
            >
              Explore a curated collection of exceptional
              timepieces. Discover iconic craftsmanship,
              timeless design, and watches made to become
              part of your story.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-3 mt-9"
              style={{
                animation: 'fadeUp 0.8s ease 0.24s both',
              }}
            >
              <Link
                to="/shop"
                className="group flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-amber-100 hover:scale-105 transition-all duration-300 shadow-xl shadow-white/5"
              >
                Shop Collection

                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/shop"
                className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                Explore Watches

                <Clock3 className="h-4 w-4 opacity-60 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>

            <div
              className="grid grid-cols-3 w-full max-w-2xl mt-14 pt-8 border-t border-white/10"
              style={{
                animation: 'fadeUp 0.8s ease 0.32s both',
              }}
            >
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">
                  Premium
                </p>

                <p className="text-[8px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                  Collection
                </p>
              </div>

              <div className="text-center border-x border-white/10">
                <p className="text-xl sm:text-2xl font-bold">
                  12+
                </p>

                <p className="text-[8px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                  Brands
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">
                  30 Days
                </p>

                <p className="text-[8px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                  Returns
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />

              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
                Handpicked For You
              </p>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Featured Watches
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Discover our most exceptional timepieces.
            </p>
          </div>

          <Link
            to="/shop"
            className="group self-start sm:self-auto flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            View All

            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="bg-gray-100 rounded-2xl sm:rounded-3xl h-[220px] sm:h-72" />

                <div className="px-1 mt-4 space-y-2">
                  <div className="bg-gray-100 h-2.5 w-20 rounded" />
                  <div className="bg-gray-100 h-4 w-32 rounded" />
                  <div className="bg-gray-100 h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : watches.length === 0 ? (
          <div className="py-16 text-center border border-gray-100 rounded-3xl bg-gray-50">
            <ShoppingBag
              className="mx-auto text-gray-300"
              size={42}
            />

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              No watches available
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              New watches will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12">
            {watches.map((watch, index) => {
              const hasDiscount =
                watch.discountPrice &&
                Number(watch.discountPrice) > 0 &&
                Number(watch.discountPrice) <
                  Number(watch.price)

              const sellingPrice = hasDiscount
                ? Number(watch.discountPrice)
                : Number(watch.price)

              const isOutOfStock =
                Number(watch.stock || 0) <= 0

              return (
                <Link
                  to={`/watches/${watch._id}`}
                  key={watch._id}
                  className="group block"
                  style={{
                    animation: `fadeUp 0.5s ease ${
                      index * 0.06
                    }s both`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-50 via-white to-amber-50/40 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <div className="relative h-[220px] sm:h-72 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-gray-100/70" />

                      <span className="absolute top-3 right-3 z-10 text-[8px] sm:text-[9px] font-semibold text-gray-300 tracking-[0.2em]">
                        0{index + 1}
                      </span>

                      {watch.tag && (
                        <span className="absolute top-3 left-3 z-20 bg-black text-white text-[7px] sm:text-[9px] font-semibold px-2.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          {watch.tag}
                        </span>
                      )}

                      {hasDiscount && (
                        <span className="absolute bottom-3 left-3 bg-amber-100 text-amber-700 text-[8px] font-bold px-2.5 py-1 rounded-full z-20">
                          SALE
                        </span>
                      )}

                      {watch.images?.[0]?.url ? (
                        <img
                          src={watch.images[0].url}
                          alt={watch.name}
                          loading="lazy"
                          className="relative z-10 w-[85%] h-[85%] object-contain transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
                        />
                      ) : (
                        <ShoppingBag
                          size={44}
                          className="relative z-10 text-gray-300"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/0 via-transparent to-purple-200/0 group-hover:from-amber-200/10 group-hover:to-purple-200/10 transition-all duration-700 pointer-events-none" />

                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                      {isOutOfStock && (
                        <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-black text-white text-[9px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-0.5 sm:px-1 pt-3 sm:pt-4">
                    <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-[0.18em] font-semibold truncate">
                      {watch.brand}
                    </p>

                    <div className="flex items-start justify-between gap-2 mt-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-5 line-clamp-2 group-hover:text-gray-500 transition-colors">
                        {watch.name}
                      </p>

                      {Number(watch.rating || 0) > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />

                          <span className="text-[9px] text-gray-500">
                            {Number(
                              watch.rating
                            ).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-gray-900">
                        ₹
                        {sellingPrice.toLocaleString(
                          'en-IN'
                        )}
                      </p>

                      {hasDiscount && (
                        <p className="text-[10px] text-gray-400 line-through">
                          ₹
                          {Number(
                            watch.price
                          ).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {Number(watch.numReviews || 0) > 0 && (
                      <p className="text-[9px] text-gray-400 mt-1">
                        {watch.numReviews}{' '}
                        {watch.numReviews === 1
                          ? 'review'
                          : 'reviews'}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="px-4 sm:px-6 mb-8">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-[#111111] via-[#191919] to-[#090909] text-white">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/10 blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative px-6 sm:px-10 py-14 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-300" />

                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200">
                  Exclusive Collection
                </p>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Your next statement
                <br />

                <span className="italic text-gray-400">
                  starts with time.
                </span>
              </h2>

              <p className="text-sm text-gray-500 mt-3 max-w-md">
                Discover premium timepieces crafted for
                people who appreciate the finer details.
              </p>
            </div>

            <Link
              to="/shop"
              className="group flex items-center gap-2 bg-white text-black font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-amber-100 hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Explore Collection

              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />

            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
              Why ChronoSphere
            </p>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            The ChronoSphere Promise
          </h2>

          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Luxury, trust and exceptional service — every
            step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-3xl border border-gray-100 bg-white hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gray-50 group-hover:scale-150 transition-transform duration-500" />

                <div
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mt-5">
                  {feature.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  {feature.desc}
                </p>

                <div className="mt-5 w-8 h-0.5 bg-gray-200 group-hover:w-14 group-hover:bg-black transition-all duration-300" />
              </div>
            )
          })}
        </div>
      </section>

      <section className="px-5 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-100/60 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-100/50 blur-3xl" />

          <div className="relative px-6 sm:px-10 md:px-16 py-12 sm:py-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-5">
              <Heart className="h-5 w-5 text-gray-700" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
              Made for Watch Lovers
            </p>

            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Find Your Perfect Timepiece
            </h2>

            <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto leading-6">
              From everyday elegance to iconic luxury,
              discover a watch that feels uniquely yours.
            </p>

            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 mt-7 bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              Start Shopping

              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

