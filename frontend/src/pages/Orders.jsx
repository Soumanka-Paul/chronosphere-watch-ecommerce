
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Loader2,
  CalendarDays,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../utils/axios'
import toast from 'react-hot-toast'

const getStatusStyle = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-50 text-green-700 border-green-100'
    case 'Processing':
      return 'bg-blue-50 text-blue-700 border-blue-100'
    case 'Shipped':
      return 'bg-yellow-50 text-yellow-700 border-yellow-100'
    case 'Cancelled':
      return 'bg-red-50 text-red-600 border-red-100'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircle className="h-3.5 w-3.5" />
    case 'Processing':
      return <Clock className="h-3.5 w-3.5" />
    case 'Shipped':
      return <Truck className="h-3.5 w-3.5" />
    case 'Cancelled':
      return <XCircle className="h-3.5 w-3.5" />
    default:
      return <Clock className="h-3.5 w-3.5" />
  }
}

const getStatusMessage = (status) => {
  switch (status) {
    case 'Delivered':
      return 'Your order has been delivered'
    case 'Processing':
      return 'Your order is being prepared'
    case 'Shipped':
      return 'Your order is on the way'
    case 'Cancelled':
      return 'This order has been cancelled'
    default:
      return 'Your order has been received'
  }
}

export default function Orders() {
  const { isLoggedIn } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (isLoggedIn) fetchOrders()
    else setLoading(false)
  }, [isLoggedIn])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/orders')

      setOrders(res.data.orders)
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    if (cancellingId) return

    try {
      setCancellingId(orderId)

      await axiosInstance.put(`/orders/${orderId}/cancel`)

      toast.success('Order cancelled')

      fetchOrders()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Cannot cancel order'

      toast.error(msg)
    } finally {
      setCancellingId(null)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-gray-300" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              ChronoSphere
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Please login first
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              Sign in to view your purchases, track deliveries,
              and manage your orders.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:bg-gray-800 hover:shadow-lg transition-all"
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
        <div className="bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="h-3 w-28 bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6"
              >
                <div className="flex justify-between gap-4 mb-6">
                  <div>
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>

                  <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-xl animate-pulse" />

                      <div className="flex-1">
                        <div className="h-3 w-40 bg-gray-100 rounded animate-pulse mb-2" />
                        <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
                      </div>

                      <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-300" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              Your Collection
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              No orders yet
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              Your next timepiece is waiting. Explore our
              collection of carefully selected watches.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length

  const activeOrders = orders.filter(
    (order) =>
      order.status === 'Pending' ||
      order.status === 'Processing' ||
      order.status === 'Shipped'
  ).length

  return (
    <div className="min-h-screen bg-[#f7f7f6]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7">
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
                My Orders
              </h1>

              <p className="text-sm text-white/50 mt-3 max-w-lg">
                Track your purchases and keep an eye on your
                latest timepieces.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-full px-5 py-3 text-xs font-semibold hover:bg-gray-100 transition-all w-fit"
            >
              Continue Shopping
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-gray-600" />
              </div>

              <span className="text-[9px] uppercase tracking-wider text-gray-400">
                Total
              </span>
            </div>

            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {orders.length}
            </p>

            <p className="text-[10px] text-gray-400 mt-1">
              Orders placed
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <Truck className="w-4 h-4 text-gray-600" />
              </div>

              <span className="text-[9px] uppercase tracking-wider text-gray-400">
                Active
              </span>
            </div>

            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeOrders}
            </p>

            <p className="text-[10px] text-gray-400 mt-1">
              In progress
            </p>
          </div>

          <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-gray-600" />
              </div>

              <span className="text-[9px] uppercase tracking-wider text-gray-400">
                Complete
              </span>
            </div>

            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {deliveredOrders}
            </p>

            <p className="text-[10px] text-gray-400 mt-1">
              Delivered orders
            </p>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Purchase History
            </p>

            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 mt-1"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Recent Orders
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            Secure purchases
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* ORDER HEADER */}
              <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                          Order
                        </p>

                        <span className="text-xs font-bold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                        <CalendarDays className="w-3 h-3" />

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[10px] font-bold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>

                    {(order.status === 'Pending' ||
                      order.status === 'Processing') && (
                      <button
                        onClick={() =>
                          handleCancel(order._id)
                        }
                        disabled={cancellingId === order._id}
                        className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order._id ? (
                          <span className="inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Cancelling
                          </span>
                        ) : (
                          'Cancel Order'
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />

                  <p className="text-[10px] text-gray-400">
                    {getStatusMessage(order.status)}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="px-5 sm:px-7 py-5">
                <div className="flex flex-col gap-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <div className="relative h-14 w-14 sm:h-16 sm:w-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-gray-300" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                            {item.brand}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">
                              Qty: {item.quantity}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-gray-300" />

                            <span className="text-[10px] text-gray-400">
                              ₹
                              {Number(
                                item.price
                              ).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER */}
              <div className="bg-gray-50/70 border-t border-gray-100 px-5 sm:px-7 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                        Delivery Location
                      </p>

                      <p className="text-xs font-medium text-gray-700">
                        {order.deliveryAddress?.city}
                        {order.deliveryAddress?.city &&
                        order.deliveryAddress?.state
                          ? ', '
                          : ''}
                        {order.deliveryAddress?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                        Order Total
                      </p>

                      <p className="text-lg font-bold text-gray-900">
                        ₹
                        {Number(
                          order.totalPrice
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {order.payment?.status && (
                      <div className="hidden sm:block">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                          Payment
                        </p>

                        <p
                          className={`text-xs font-semibold capitalize ${
                            order.payment.status === 'paid'
                              ? 'text-green-600'
                              : order.payment.status ===
                                'failed'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {order.payment.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM TRUST */}
        <div className="mt-8 bg-black text-white rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Your purchases are protected
                </p>

                <p className="text-[10px] text-white/40 mt-1">
                  Secure payments and trusted order processing.
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white text-black rounded-full px-5 py-3 hover:bg-gray-100 transition-colors"
            >
              Shop More
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

