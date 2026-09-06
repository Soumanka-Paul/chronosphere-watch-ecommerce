import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import Watch from '../models/watch.model.js'

// =====================================================
// PLACE ORDER
// =====================================================

export const placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body

    // ---------------------------------------------
    // 1. Validate items
    // ---------------------------------------------

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'No items in the order',
      })
    }

    // ---------------------------------------------
    // 2. Validate delivery address
    // ---------------------------------------------

    if (!deliveryAddress) {
      return res.status(400).json({
        message: 'Delivery address is required',
      })
    }

    const requiredAddressFields = [
      'name',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
    ]

    for (const field of requiredAddressFields) {
      if (!deliveryAddress[field]?.trim()) {
        return res.status(400).json({
          message: `${field} is required`,
        })
      }
    }

    // ---------------------------------------------
    // 3. Validate watch IDs
    // ---------------------------------------------

    for (const item of items) {
      if (!item.watch) {
        return res.status(400).json({
          message: 'Watch ID is required for every item',
        })
      }

      if (!mongoose.Types.ObjectId.isValid(item.watch)) {
        return res.status(400).json({
          message: `Invalid watch ID: ${item.watch}`,
        })
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: 'Quantity must be a positive integer',
        })
      }
    }

    // ---------------------------------------------
    // 4. Get watch IDs
    // ---------------------------------------------

    const watchIds = items.map((item) => item.watch)

    // ---------------------------------------------
    // 5. Fetch actual watches from MongoDB
    // ---------------------------------------------

    const watches = await Watch.find({
      _id: { $in: watchIds },
    })

    // ---------------------------------------------
    // 6. Check if every watch exists
    // ---------------------------------------------

    if (watches.length !== watchIds.length) {
      return res.status(404).json({
        message: 'One or more watches were not found',
      })
    }

    // ---------------------------------------------
    // 7. Create a quick lookup map
    // ---------------------------------------------

    const watchMap = new Map()

    watches.forEach((watch) => {
      watchMap.set(watch._id.toString(), watch)
    })

    // ---------------------------------------------
    // 8. Calculate prices from DATABASE
    // ---------------------------------------------

    let originalTotal = 0
    let finalTotal = 0

    const orderItems = []

    for (const item of items) {
      const watch = watchMap.get(item.watch.toString())

      if (!watch) {
        return res.status(404).json({
          message: 'Watch not found',
        })
      }

      const quantity = Number(item.quantity)

      // -----------------------------------------
      // Check stock
      // -----------------------------------------

      if (watch.stock < quantity) {
        return res.status(400).json({
          message: `${watch.name} has only ${watch.stock} item(s) left in stock`,
        })
      }

      // -----------------------------------------
      // Original price from DB
      // -----------------------------------------

      const originalPrice = Number(watch.price)

      // -----------------------------------------
      // Discount price from DB
      // -----------------------------------------

      const discountPrice =
        watch.discountPrice &&
        Number(watch.discountPrice) > 0 &&
        Number(watch.discountPrice) < originalPrice
          ? Number(watch.discountPrice)
          : null

      // -----------------------------------------
      // Actual selling price
      // -----------------------------------------

      const sellingPrice =
        discountPrice ?? originalPrice

      // -----------------------------------------
      // Calculate totals
      // -----------------------------------------

      originalTotal += originalPrice * quantity

      finalTotal += sellingPrice * quantity

      // -----------------------------------------
      // Store product snapshot
      // -----------------------------------------

      orderItems.push({
        watch: watch._id,

        name: watch.name,

        brand: watch.brand,

        originalPrice,

        discountPrice,

        // Actual price customer pays
        price: sellingPrice,

        quantity,

        image:
          watch.images?.[0]?.url || '',
      })
    }

    // ---------------------------------------------
    // 9. Calculate total discount
    // ---------------------------------------------

    const discount = Math.max(
      0,
      originalTotal - finalTotal
    )

    // ---------------------------------------------
    // 10. Create order
    // ---------------------------------------------

    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      deliveryAddress,

      originalTotal,

      discount,

      totalPrice: finalTotal,

      payment: {
        method: 'Razorpay',
        status: 'pending',
      },

      status: 'Pending',
    })

    // ---------------------------------------------
    // 11. Send response
    // ---------------------------------------------

    res.status(201).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Place order error:', error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// =====================================================
// GET MY ORDERS
// =====================================================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    console.error('Get orders error:', error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// =====================================================
// GET ORDER BY ID
// =====================================================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // ---------------------------------------------
    // Check ownership
    // ---------------------------------------------

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      })
    }

    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Get order by ID error:', error)

    res.status(500).json({
      message: error.message,
    })
  }
}

// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // ---------------------------------------------
    // Check ownership
    // ---------------------------------------------

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      })
    }

    // ---------------------------------------------
    // Check order status
    // ---------------------------------------------

    if (
      order.status === 'Shipped' ||
      order.status === 'Delivered'
    ) {
      return res.status(400).json({
        message: `Cannot cancel order that is ${order.status}`,
      })
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        message: 'Order is already cancelled',
      })
    }

    // ---------------------------------------------
    // Cancel order
    // ---------------------------------------------

    order.status = 'Cancelled'

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    })
  } catch (error) {
    console.error('Cancel order error:', error)

    res.status(500).json({
      message: error.message,
    })
  }
}