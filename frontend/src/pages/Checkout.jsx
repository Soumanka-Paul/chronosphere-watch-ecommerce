
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  User,
  Home,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import axiosInstance from '../utils/axios'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()

  const {
    cart,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    clearCart,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validate = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name')
      return false
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      toast.error('Please enter a valid 10 digit phone number')
      return false
    }

    if (!form.address.trim()) {
      toast.error('Please enter your address')
      return false
    }

    if (!form.city.trim()) {
      toast.error('Please enter your city')
      return false
    }

    if (!form.state.trim()) {
      toast.error('Please enter your state')
      return false
    }

    if (!/^[0-9]{6}$/.test(form.pincode.trim())) {
      toast.error('Please enter a valid 6 digit pincode')
      return false
    }

    return true
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {
    if (loading) return

    if (!validate()) return

    if (!cart.length) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }

    setLoading(true)

    try {
      const razorpayLoaded = await loadRazorpay()

      if (!razorpayLoaded) {
        throw new Error('Razorpay failed to load')
      }

      const orderItems = cart.map((item) => ({
        watch: item.id,
        quantity: Number(item.quantity) || 1,
      }))

      const orderResponse = await axiosInstance.post('/orders', {
        items: orderItems,

        deliveryAddress: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
      })

      const mongoOrder = orderResponse.data.order

      if (!mongoOrder?._id) {
        throw new Error('Order creation failed')
      }

      const paymentResponse = await axiosInstance.post(
        '/payment/order',
        {
          orderId: mongoOrder._id,
        }
      )

      const razorpayOrder = paymentResponse.data.order
      const razorpayKey = paymentResponse.data.key

      if (!razorpayOrder?.id || !razorpayKey) {
        throw new Error('Unable to create Razorpay order')
      }

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: 'ChronoSphere',

        description: 'Watch Purchase',

        order_id: razorpayOrder.id,

        prefill: {
          name: form.name.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          orderId: mongoOrder._id,
        },

        theme: {
          color: '#000000',
        },

        handler: async (response) => {
          try {
            const verifyResponse = await axiosInstance.post(
              '/payment/verify',
              {
                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpaySignature:
                  response.razorpay_signature,

                orderId: mongoOrder._id,
              }
            )

            if (verifyResponse.data.success) {
              clearCart()

              toast.success(
                'Payment successful! Order placed.'
              )

              navigate('/orders')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            console.error(
              'Payment verification error:',
              error
            )

            toast.error(
              error.response?.data?.message ||
                'Payment verification failed'
            )
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)

            toast.error('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', (response) => {
        console.error(
          'Razorpay payment failed:',
          response
        )

        setLoading(false)

        toast.error(
          response.error?.description ||
            'Payment failed. Please try again.'
        )
      })

      razorpay.open()
    } catch (error) {
      console.error('Checkout error:', error)

      setLoading(false)

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong. Please try again.'
      )
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white border border-gray-100 rounded-3xl p-10 shadow-sm max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-gray-500" />
          </div>

          <h2
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Your cart is empty
          </h2>

          <p className="text-sm text-gray-500 mb-7">
            Add a watch to your cart before proceeding to
            checkout.
          </p>

          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-black text-white py-3.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
          >
            Explore Watches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6]">
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-32 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-9 sm:py-12">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-7"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-3">
                ChronoSphere
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Complete Your Order
              </h1>

              <p className="text-sm text-white/50 mt-3 max-w-lg">
                Enter your delivery details and securely
                complete your watch purchase.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60 bg-white/10 border border-white/10 rounded-full px-4 py-2.5 w-fit">
              <Lock className="w-3.5 h-3.5" />
              Secure Checkout
            </div>
          </div>
        </div>
      </section>

      {/* CHECKOUT STEPS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 relative z-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>

              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Step 01
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  Cart
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-bold">
                2
              </div>

              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Step 02
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  Delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 text-xs font-bold">
                3
              </div>

              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Step 03
                </p>
                <p className="text-xs font-semibold text-gray-500">
                  Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* DELIVERY CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Delivery Address
                    </h2>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Where should we deliver your watch?
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Private
                </span>
              </div>

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* NAME */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      Full Name
                    </label>

                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />

                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      Phone Number
                    </label>

                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="10 digit mobile number"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10}
                        inputMode="numeric"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      Street Address
                    </label>

                    <div className="relative group">
                      <Home className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />

                      <textarea
                        name="address"
                        placeholder="House no, Street, Area"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>

                  {/* STATE */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      placeholder="Your state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>

                  {/* PINCODE */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="6 digit pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      inputMode="numeric"
                      className="w-full sm:max-w-[50%] px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECURITY FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-gray-700" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Secure Payment
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Protected checkout
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-gray-700" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Free Shipping
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    On every order
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-700" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Encrypted
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Your data is protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* SUMMARY */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-xl font-bold text-gray-900"
                      style={{
                        fontFamily:
                          "'Playfair Display', serif",
                      }}
                    >
                      Order Summary
                    </h2>

                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      {cart.length}{' '}
                      {cart.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="p-5 sm:p-6 space-y-4 max-h-[360px] overflow-y-auto">
                  {cart.map((item) => {
                    const originalPrice =
                      Number(
                        item.originalPrice ??
                          item.price ??
                          0
                      )

                    const sellingPrice =
                      Number(item.price) || 0

                    const quantity =
                      Number(item.quantity) || 0

                    const hasDiscount =
                      item.discountPrice !== null &&
                      item.discountPrice !== undefined &&
                      Number(item.discountPrice) <
                        originalPrice

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-gray-400 mt-1">
                            Qty {quantity}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-bold text-gray-900">
                              ₹
                              {sellingPrice.toLocaleString(
                                'en-IN'
                              )}
                            </span>

                            {hasDiscount && (
                              <span className="text-[9px] text-gray-400 line-through">
                                ₹
                                {originalPrice.toLocaleString(
                                  'en-IN'
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-gray-900">
                            ₹
                            {(
                              sellingPrice * quantity
                            ).toLocaleString('en-IN')}
                          </p>

                          {hasDiscount && (
                            <p className="text-[9px] text-green-600 mt-1">
                              Saved ₹
                              {(
                                (originalPrice -
                                  sellingPrice) *
                                quantity
                              ).toLocaleString(
                                'en-IN'
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* PRICES */}
                <div className="border-t border-gray-100 p-5 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-gray-900">
                        ₹
                        {Number(
                          totalOriginalPrice
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {Number(totalDiscount) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Discount
                        </span>

                        <span className="font-semibold text-green-600">
                          -₹
                          {Number(
                            totalDiscount
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Shipping
                      </span>

                      <span className="font-semibold text-green-600">
                        Free
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                          Total Payable
                        </p>

                        <p className="text-2xl font-bold text-gray-900">
                          ₹
                          {Number(
                            totalPrice
                          ).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  {Number(totalDiscount) > 0 && (
                    <div className="mt-5 rounded-xl bg-green-50 border border-green-100 px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />

                        <p className="text-xs font-semibold text-green-700">
                          You save ₹
                          {Number(
                            totalDiscount
                          ).toLocaleString(
                            'en-IN'
                          )}{' '}
                          on this order
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PAY BUTTON */}
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`w-full mt-5 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      loading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ₹
                        {Number(
                          totalPrice
                        ).toLocaleString('en-IN')}
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
                    You will be securely redirected to
                    Razorpay to complete your payment.
                  </p>
                </div>
              </div>

              {/* TRUST CARD */}
              <div className="bg-black text-white rounded-3xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Shop with confidence
                    </p>

                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Your payment is processed securely
                      through Razorpay. ChronoSphere never
                      stores your card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
