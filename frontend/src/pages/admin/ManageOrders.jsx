
import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Loader2,
  RefreshCw,
  ChevronDown,
  Package,
  CreditCard,
  User,
  CalendarDays,
} from 'lucide-react'
import toast from 'react-hot-toast'

import axiosInstance from '../../utils/axios'

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  // ============================================
  // FETCH ORDERS
  // ============================================

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/admin/orders')

      setOrders(res.data.orders || [])
    } catch (error) {
      console.error('Fetch orders error:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to load orders'
      )
    } finally {
      setLoading(false)
    }
  }


  // ============================================
  // UPDATE ORDER STATUS
  // ============================================

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)

      const res = await axiosInstance.put(
        `/admin/orders/${orderId}`,
        {
          status: newStatus,
        }
      )

      const updatedOrder = res.data.order

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? updatedOrder || {
                ...order,
                status: newStatus,
              }
            : order
        )
      )

      toast.success(
        res.data.message ||
        'Order status updated successfully'
      )

    } catch (error) {
      console.error('Update order error:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to update order status'
      )
    } finally {
      setUpdatingId(null)
    }
  }


  // ============================================
  // FORMAT PRICE
  // ============================================

  const formatPrice = (price = 0) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }


  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }


  // ============================================
  // GET ORDER TOTAL
  // ============================================

  const getOrderTotal = (order) => {
    return (
      order.totalPrice ??
      order.totalAmount ??
      order.amount ??
      order.total ??
      0
    )
  }


  // ============================================
  // GET PAYMENT STATUS
  // ============================================

  const getPaymentStatus = (order) => {
    if (order.payment?.status) {
      return order.payment.status
    }

    if (order.paymentStatus) {
      return order.paymentStatus
    }

    if (order.isPaid) {
      return 'Paid'
    }

    return 'Pending'
  }


  // ============================================
  // PAYMENT STYLE
  // ============================================

  const getPaymentStyle = (status) => {
    const value = status?.toLowerCase()

    if (
      value === 'paid' ||
      value === 'success' ||
      value === 'completed'
    ) {
      return 'bg-green-50 text-green-700'
    }

    if (
      value === 'failed' ||
      value === 'cancelled'
    ) {
      return 'bg-red-50 text-red-700'
    }

    return 'bg-yellow-50 text-yellow-700'
  }


  // ============================================
  // ORDER STATUS STYLE
  // ============================================

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700'

      case 'Processing':
        return 'bg-blue-50 text-blue-700'

      case 'Shipped':
        return 'bg-purple-50 text-purple-700'

      case 'Delivered':
        return 'bg-green-50 text-green-700'

      case 'Cancelled':
        return 'bg-red-50 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }


  // ============================================
  // ORDER STATUSES
  // ============================================

  const statuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
      ">
        <div className="
          flex
          flex-col
          items-center
          gap-3
        ">
          <Loader2
            size={32}
            className="animate-spin text-black"
          />

          <p className="text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div>

          <p className="
            text-sm
            text-gray-400
            mb-1
          ">
            Order Management
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-900
            "
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Manage Orders
          </h1>

          <p className="
            text-sm
            text-gray-500
            mt-2
          ">
            View and manage customer orders.
          </p>

        </div>


        <button
          onClick={fetchOrders}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            border
            border-gray-200
            rounded-xl
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-100
            transition
            disabled:opacity-50
          "
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* ========================================
          ORDER COUNT
          ======================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-4
      ">

        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              flex
              items-center
              justify-center
            ">
              <ShoppingBag
                size={20}
                className="text-gray-700"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Total Orders
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {orders.length}
              </p>

            </div>

          </div>

        </div>


        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-yellow-50
              flex
              items-center
              justify-center
            ">
              <Package
                size={20}
                className="text-yellow-600"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Pending
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {
                  orders.filter(
                    (order) =>
                      order.status === 'Pending'
                  ).length
                }
              </p>

            </div>

          </div>

        </div>


        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-green-50
              flex
              items-center
              justify-center
            ">
              <CreditCard
                size={20}
                className="text-green-600"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Delivered
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {
                  orders.filter(
                    (order) =>
                      order.status === 'Delivered'
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ORDERS TABLE
          ======================================== */}

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">

        {orders.length === 0 ? (

          <div className="
            py-16
            text-center
          ">

            <ShoppingBag
              size={42}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h3 className="
              text-lg
              font-semibold
              text-gray-900
              mt-4
            ">
              No orders yet
            </h3>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="
              w-full
              min-w-[1050px]
            ">

              <thead>

                <tr className="
                  border-b
                  border-gray-100
                  bg-gray-50/50
                ">

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Customer
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Order
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Amount
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Payment
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Date
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => {

                  const paymentStatus =
                    getPaymentStatus(order)

                  return (
                    <tr
                      key={order._id}
                      className="
                        border-b
                        border-gray-50
                        last:border-0
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* CUSTOMER */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-9
                            h-9
                            rounded-full
                            bg-black
                            text-white
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          ">
                            <User size={16} />
                          </div>

                          <div>

                            <p className="
                              text-sm
                              font-semibold
                              text-gray-900
                            ">
                              {order.user?.name ||
                                'Unknown User'}
                            </p>

                            <p className="
                              text-xs
                              text-gray-400
                              mt-0.5
                            ">
                              {order.user?.email ||
                                'No email'}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ORDER ID */}
                      <td className="px-5 py-4">

                        <p className="
                          text-xs
                          font-mono
                          text-gray-600
                        ">
                          #{order._id?.slice(-8)}
                        </p>

                        {order.items && (
                          <p className="
                            text-xs
                            text-gray-400
                            mt-1
                          ">
                            {order.items.length} item
                            {order.items.length === 1
                              ? ''
                              : 's'}
                          </p>
                        )}

                      </td>


                      {/* AMOUNT */}
                      <td className="
                        px-5
                        py-4
                        text-sm
                        font-semibold
                        text-gray-900
                      ">
                        {formatPrice(
                          getOrderTotal(order)
                        )}
                      </td>


                      {/* PAYMENT */}
                      <td className="px-5 py-4">

                        <span className={`
                          inline-flex
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${getPaymentStyle(
                            paymentStatus
                          )}
                        `}>
                          {paymentStatus}
                        </span>

                      </td>


                      {/* DATE */}
                      <td className="
                        px-5
                        py-4
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-500
                        ">
                          <CalendarDays size={15} />

                          {formatDate(
                            order.createdAt
                          )}
                        </div>

                      </td>


                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <div className="
                          relative
                          inline-flex
                        ">

                          <select
                            value={
                              order.status ||
                              'Pending'
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value
                              )
                            }
                            disabled={
                              updatingId ===
                              order._id
                            }
                            className={`
                              appearance-none
                              pl-3
                              pr-9
                              py-2
                              rounded-lg
                              border-0
                              text-xs
                              font-semibold
                              outline-none
                              cursor-pointer
                              disabled:opacity-60
                              disabled:cursor-wait
                              ${getStatusStyle(
                                order.status
                              )}
                            `}
                          >

                            {statuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}

                          </select>


                          {updatingId ===
                          order._id ? (

                            <Loader2
                              size={14}
                              className="
                                absolute
                                right-2
                                top-1/2
                                -translate-y-1/2
                                animate-spin
                              "
                            />

                          ) : (

                            <ChevronDown
                              size={14}
                              className="
                                absolute
                                right-2
                                top-1/2
                                -translate-y-1/2
                                pointer-events-none
                              "
                            />

                          )}

                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

