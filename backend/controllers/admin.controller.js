import User  from '../models/user.model.js'
import Watch from '../models/watch.model.js'
import Order from '../models/order.model.js'

// ─────────────────────────────────────
// GET DASHBOARD STATS
// GET /api/admin/stats
// Private + Admin
// ─────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {

    // Run all queries at the same time
    // Promise.all → faster than running one by one
    const [
      totalUsers,
      totalWatches,
      totalOrders,
      orders,
    ] = await Promise.all([
      User.countDocuments(),
      Watch.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ])

    // Calculate total revenue
    // Only count paid orders
    const totalRevenue = orders
      .filter((o) => o.payment.status === 'paid')
      .reduce((sum, o) => sum + o.totalPrice, 0)

    // Count orders by status
    const pendingOrders   = orders.filter((o) => o.status === 'Pending').length
    const processingOrders= orders.filter((o) => o.status === 'Processing').length
    const shippedOrders   = orders.filter((o) => o.status === 'Shipped').length
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalWatches,
        totalOrders,
        totalRevenue,
        ordersByStatus: {
          pending:    pendingOrders,
          processing: processingOrders,
          shipped:    shippedOrders,
          delivered:  deliveredOrders,
          cancelled:  cancelledOrders,
        },
      },
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// GET ALL ORDERS
// GET /api/admin/orders
// Private + Admin
// ─────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {

    // Get all orders
    // populate user → shows user name + email
    // instead of just user id
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count:   orders.length,
      orders,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id
// Private + Admin
// ─────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body

    // Check status is valid
    const validStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      })
    }

    // Find and update order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({
      success: true,
      order,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// GET ALL USERS
// GET /api/admin/users
// Private + Admin
// ─────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {

    // Get all users
    // Don't return password
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count:   users.length,
      users,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// DELETE USER
// DELETE /api/admin/users/:id
// Private + Admin
// ─────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot delete your own account'
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}