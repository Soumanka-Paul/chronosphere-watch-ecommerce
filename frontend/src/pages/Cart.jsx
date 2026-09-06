
import { Link, useNavigate } from 'react-router-dom'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const {
    cart,
    increment,
    decrement,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
  } = useCart()

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }

    navigate('/checkout')
  }

  const getItemPrice = (item) => {
    const price = Number(item.price)

    return Number.isFinite(price) ? price : 0
  }

  const getOriginalPrice = (item) => {
    const originalPrice = Number(
      item.originalPrice ?? item.price
    )

    return Number.isFinite(originalPrice)
      ? originalPrice
      : 0
  }

  const hasDiscount = (item) => {
    const originalPrice = getOriginalPrice(item)
    const sellingPrice = getItemPrice(item)

    return originalPrice > sellingPrice
  }

  const getDiscountPercentage = (item) => {
    const originalPrice = getOriginalPrice(item)
    const sellingPrice = getItemPrice(item)

    if (!originalPrice || sellingPrice >= originalPrice) {
      return 0
    }

    return Math.round(
      ((originalPrice - sellingPrice) / originalPrice) * 100
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="relative overflow-hidden bg-black text-white">
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.2em] text-gray-300 mb-6">
              <ShoppingBag className="h-3.5 w-3.5" />
              Your Shopping Bag
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Your cart is waiting
            </h1>

            <p className="text-gray-400 text-sm md:text-base mt-4 max-w-md mx-auto">
              Discover a timepiece that perfectly matches
              your style and personality.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-md">
            <div className="relative mx-auto w-fit mb-8">
              <div className="absolute inset-0 bg-gray-200 rounded-full blur-2xl opacity-60 animate-pulse" />

              <div className="relative bg-white rounded-full p-8 shadow-xl border border-gray-100">
                <ShoppingBag className="h-14 w-14 text-gray-300" />
              </div>
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Nothing here yet
            </h2>

            <p className="text-gray-500 text-sm leading-6 mb-8">
              Your perfect watch is only a few clicks away.
              Explore our collection and find something
              timeless.
            </p>

            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Watches
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-52 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Curated Collection
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                My Cart
              </h1>

              <p className="text-gray-400 text-sm mt-3">
                {totalItems}{' '}
                {totalItems === 1 ? 'item' : 'items'} selected
                for your collection
              </p>
            </div>

            <button
              onClick={() => {
                clearCart()
                toast.success('Cart cleared')
              }}
              className="self-start md:self-auto inline-flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 rounded-full px-4 py-2.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item, index) => {
              const sellingPrice = getItemPrice(item)
              const originalPrice = getOriginalPrice(item)
              const discounted = hasDiscount(item)
              const discountPercentage =
                getDiscountPercentage(item)

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    animation: `fadeUp 0.5s ease ${
                      index * 0.08
                    }s both`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="relative bg-gray-50 rounded-2xl h-28 w-full sm:h-28 sm:w-28 flex items-center justify-center p-3 shrink-0 border border-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-100 opacity-70" />

                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <ShoppingBag className="relative h-9 w-9 text-gray-300" />
                      )}

                      {discounted && (
                        <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-full">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400 uppercase tracking-[0.18em] mb-1">
                            {item.brand}
                          </p>

                          <p className="text-base font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.id)
                            toast.success(
                              `${item.name} removed`
                            )
                          }}
                          className="sm:hidden shrink-0 p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-lg font-bold text-gray-900">
                          ₹
                          {sellingPrice.toLocaleString(
                            'en-IN'
                          )}
                        </p>

                        {discounted && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹
                            {originalPrice.toLocaleString(
                              'en-IN'
                            )}
                          </p>
                        )}
                      </div>

                      {discounted && (
                        <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          You save ₹
                          {(
                            originalPrice -
                            sellingPrice
                          ).toLocaleString('en-IN')}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400">
                            Quantity
                          </span>

                          <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
                            <button
                              onClick={() =>
                                decrement(item.id)
                              }
                              className="h-6 w-6 flex items-center justify-center rounded-full text-gray-500 hover:bg-black hover:text-white transition-all duration-300"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="text-sm font-bold text-gray-900 w-5 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increment(item.id)
                              }
                              className="h-6 w-6 flex items-center justify-center rounded-full text-gray-500 hover:bg-black hover:text-white transition-all duration-300"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.id)
                            toast.success(
                              `${item.name} removed`
                            )
                          }}
                          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end justify-center min-w-[100px]">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                        Item Total
                      </p>

                      <p className="text-lg font-bold text-gray-900">
                        ₹
                        {(
                          sellingPrice * item.quantity
                        ).toLocaleString('en-IN')}
                      </p>

                      {discounted && (
                        <p className="text-xs text-gray-400 line-through mt-1">
                          ₹
                          {(
                            originalPrice * item.quantity
                          ).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Summary
                  </p>

                  <h2
                    className="text-xl font-bold text-gray-900"
                    style={{
                      fontFamily:
                        "'Playfair Display', serif",
                    }}
                  >
                    Order Summary
                  </h2>
                </div>

                <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-gray-600" />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto pr-1 flex flex-col gap-4 mb-6">
                {cart.map((item) => {
                  const sellingPrice = getItemPrice(item)
                  const originalPrice =
                    getOriginalPrice(item)
                  const discounted = hasDiscount(item)

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 p-1.5 shrink-0">
                          {item.img ? (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ShoppingBag className="h-full w-full text-gray-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate max-w-[130px]">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Qty {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-gray-800">
                          ₹
                          {(
                            sellingPrice *
                            item.quantity
                          ).toLocaleString('en-IN')}
                        </p>

                        {discounted && (
                          <p className="text-[10px] text-gray-400 line-through mt-0.5">
                            ₹
                            {(
                              originalPrice *
                              item.quantity
                            ).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Subtotal
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    ₹
                    {totalOriginalPrice.toLocaleString(
                      'en-IN'
                    )}
                  </p>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-sm text-green-600">
                      Discount
                    </p>

                    <p className="text-sm font-semibold text-green-600">
                      -₹
                      {totalDiscount.toLocaleString(
                        'en-IN'
                      )}
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Shipping
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-green-600" />

                    <p className="text-sm font-semibold text-green-600">
                      Free
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total Amount
                    </p>

                    <p className="text-xl font-bold text-gray-900">
                      ₹
                      {totalPrice.toLocaleString(
                        'en-IN'
                      )}
                    </p>
                  </div>

                  {totalDiscount > 0 && (
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Save ₹
                      {totalDiscount.toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="group w-full mt-7 bg-black text-white text-sm font-semibold py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Free Shipping
              </p>

              <p className="text-xs text-gray-400 mt-1">
                On every order
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Secure Shopping
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your data is protected
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Safe Payments
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Trusted payment gateway
              </p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
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

