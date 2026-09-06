
import { useEffect, useState } from 'react'
import {
  Users,
  Watch,
  ShoppingBag,
  IndianRupee,
  Clock3,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import axiosInstance from '../../utils/axios'

export default function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [statsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/orders'),
      ])

      setStats(statsRes.data.stats)
      setRecentOrders(ordersRes.data.orders?.slice(0, 5) || [])
    } catch (error) {
      console.error('Dashboard error:', error)

      toast.error(
        error.response?.data?.message ||
          'Failed to load dashboard data'
      )
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100'

      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-100'

      case 'Shipped':
        return 'bg-violet-50 text-violet-700 border-violet-100'

      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'

      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100'

      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  const getPaymentStatus = (order) => {
    if (order.payment?.status) {
      return order.payment.status
    }

    if (order.isPaid) {
      return 'Paid'
    }

    return 'Pending'
  }

  const getPaymentStyle = (status) => {
    const normalizedStatus = status?.toLowerCase()

    if (
      normalizedStatus === 'paid' ||
      normalizedStatus === 'success' ||
      normalizedStatus === 'completed'
    ) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }

    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  const statCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.totalUsers || 0,
          icon: Users,
          description: 'Registered customers',
          accent: 'from-blue-500/10 to-transparent',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
        },
        {
          title: 'Total Watches',
          value: stats.totalWatches || 0,
          icon: Watch,
          description: 'Products in store',
          accent: 'from-violet-500/10 to-transparent',
          iconBg: 'bg-violet-50',
          iconColor: 'text-violet-600',
        },
        {
          title: 'Total Orders',
          value: stats.totalOrders || 0,
          icon: ShoppingBag,
          description: 'Orders received',
          accent: 'from-amber-500/10 to-transparent',
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
        },
        {
          title: 'Total Revenue',
          value: formatCurrency(stats.totalRevenue || 0),
          icon: IndianRupee,
          description: 'From paid orders',
          accent: 'from-emerald-500/15 to-transparent',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          featured: true,
        },
      ]
    : []

  const statusCards = [
    {
      title: 'Pending',
      value: stats?.ordersByStatus?.pending || 0,
      icon: Clock3,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      dot: 'bg-amber-500',
    },
    {
      title: 'Processing',
      value: stats?.ordersByStatus?.processing || 0,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      dot: 'bg-blue-500',
    },
    {
      title: 'Shipped',
      value: stats?.ordersByStatus?.shipped || 0,
      icon: Truck,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      dot: 'bg-violet-500',
    },
    {
      title: 'Delivered',
      value: stats?.ordersByStatus?.delivered || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      dot: 'bg-emerald-500',
    },
    {
      title: 'Cancelled',
      value: stats?.ordersByStatus?.cancelled || 0,
      icon: XCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      dot: 'bg-red-500',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <Watch size={22} className="text-gray-800" />
          </div>

          <p className="text-sm text-gray-500 mt-5 animate-pulse">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <ShoppingBag className="text-gray-400" />
        </div>

        <p className="text-gray-500">
          Unable to load dashboard.
        </p>

        <button
          onClick={fetchDashboardData}
          className="mt-5 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-full space-y-8 pb-8">
      <div className="absolute -top-20 right-0 w-72 h-72 bg-gray-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[500px] -left-32 w-72 h-72 bg-gray-100/50 rounded-full blur-3xl pointer-events-none" />

      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-gray-300 mb-4">
              <Sparkles size={13} />
              ChronoSphere Admin
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Welcome back 👋
            </p>

            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Dashboard
            </h1>

            <p className="text-sm text-gray-400 mt-2 max-w-lg">
              Monitor your store performance, orders and customer activity
              from one place.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            View Store
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              style={{
                animation: `fadeUp 0.5s ease-out ${index * 0.08}s both`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {card.title}
                    </p>

                    <h2
                      className={`mt-2 text-2xl font-bold text-gray-900 ${
                        card.featured ? 'sm:text-[27px]' : ''
                      }`}
                    >
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon
                      size={21}
                      className={`${card.iconColor} transition-transform duration-500`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp size={11} />
                    Active
                  </div>

                  <p className="text-xs text-gray-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Overview
              </h2>

              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Current status of all orders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statusCards.map((card, index) => {
            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
                style={{
                  animation: `fadeUp 0.5s ease-out ${
                    0.25 + index * 0.07
                  }s both`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={19}
                      className={card.iconColor}
                    />
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full ${card.dot} animate-pulse`}
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  {card.title}
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest orders placed by customers
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/orders')}
            className="group flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
          >
            View All
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          {recentOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
                <ShoppingBag
                  size={28}
                  className="text-gray-300"
                />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      Payment
                    </th>

                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      Status
                    </th>

                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => {
                    const paymentStatus =
                      getPaymentStatus(order)

                    return (
                      <tr
                        key={order._id}
                        className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-all duration-300"
                        style={{
                          animation: `fadeUp 0.45s ease-out ${
                            0.4 + index * 0.08
                          }s both`,
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-sm font-semibold group-hover:scale-105 transition-transform">
                              {(
                                order.user?.name || 'U'
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {order.user?.name ||
                                  'Unknown User'}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                {order.user?.email ||
                                  'No email'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(
                              order.totalPrice ||
                                order.totalAmount ||
                                order.amount ||
                                0
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border ${getPaymentStyle(
                              paymentStatus
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {paymentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-semibold border ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status || 'Pending'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
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

