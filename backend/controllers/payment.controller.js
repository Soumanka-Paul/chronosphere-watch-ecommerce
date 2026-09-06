import mongoose from 'mongoose'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/order.model.js'
import Watch from '../models/watch.model.js'



// =====================================================
// CREATE RAZORPAY PAYMENT ORDER
// =====================================================

export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body

    // ---------------------------------------------
    // 1. Validate order ID
    // ---------------------------------------------

    if (!orderId) {
      return res.status(400).json({
        message: 'Order ID is required',
      })
    }

    // ---------------------------------------------
    // 2. Validate MongoDB ObjectId
    // ---------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: 'Invalid order ID',
      })
    }

    // ---------------------------------------------
    // 3. Find order
    // ---------------------------------------------

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // ---------------------------------------------
    // 4. Check ownership
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
    // 5. Check order status
    // ---------------------------------------------

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        message:
          'Cannot make payment for a cancelled order',
      })
    }

    // ---------------------------------------------
    // 6. Check payment status
    // ---------------------------------------------

    if (order.payment.status === 'paid') {
      return res.status(400).json({
        message: 'Order is already paid',
      })
    }

    // ---------------------------------------------
    // 7. Get amount ONLY from DATABASE
    // ---------------------------------------------

    const amount = Number(order.totalPrice)

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Invalid order amount',
      })
    }

    // ---------------------------------------------
    // 8. Create Razorpay instance
    // ---------------------------------------------

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    // ---------------------------------------------
    // 9. Create Razorpay order
    // ---------------------------------------------

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${order._id}`,
    }

    const razorpayOrder =
      await razorpay.orders.create(options)

    // ---------------------------------------------
    // 10. Save Razorpay order ID
    // ---------------------------------------------

    order.payment.razorpayOrderId =
      razorpayOrder.id

    await order.save()

    // ---------------------------------------------
    // 11. Send response
    // ---------------------------------------------

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error(
      'Create payment order error:',
      error
    )

    res.status(500).json({
      message: error.message,
    })
  }
}

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body

    // ---------------------------------------------
    // 1. Validate payment fields
    // ---------------------------------------------

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return res.status(400).json({
        message:
          'All payment fields are required',
      })
    }

    // ---------------------------------------------
    // 2. Validate order ID
    // ---------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: 'Invalid order ID',
      })
    }

    // ---------------------------------------------
    // 3. Find order
    // ---------------------------------------------

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // ---------------------------------------------
    // 4. Check ownership
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
    // 5. Make sure Razorpay order matches
    // ---------------------------------------------

    if (
      !order.payment.razorpayOrderId ||
      order.payment.razorpayOrderId !==
        razorpayOrderId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay order',
      })
    }

    // ---------------------------------------------
    // 6. Don't verify already-paid order
    // ---------------------------------------------

    if (order.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message:
          'Payment has already been verified',
      })
    }

    // ---------------------------------------------
    // 7. Generate expected signature
    // ---------------------------------------------

    const body =
      razorpayOrderId +
      '|' +
      razorpayPaymentId

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest('hex')

    // ---------------------------------------------
    // 8. Check signature length
    // ---------------------------------------------

    if (
      expectedSignature.length !==
      razorpaySignature.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment verification failed',
      })
    }

    // ---------------------------------------------
    // 9. Timing-safe comparison
    // ---------------------------------------------

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    )

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          'Payment verification failed',
      })
    }

    // =================================================
    // PAYMENT IS VERIFIED
    // =================================================

    // ---------------------------------------------
    // 10. Decrease stock
    // ---------------------------------------------

    for (const item of order.items) {
      const updatedWatch =
        await Watch.findOneAndUpdate(
          {
            _id: item.watch,

            // Make sure stock is still sufficient
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
          }
        )

      // -------------------------------------------
      // Stock unavailable
      // -------------------------------------------

      if (!updatedWatch) {
        return res.status(400).json({
          success: false,
          message:
            `${item.name} is no longer available in the requested quantity`,
        })
      }
    }

    // ---------------------------------------------
    // 11. Update payment information
    // ---------------------------------------------

    order.payment.status = 'paid'

    order.payment.razorpayOrderId =
      razorpayOrderId

    order.payment.razorpayPaymentId =
      razorpayPaymentId

    // ---------------------------------------------
    // 12. Update order status
    // ---------------------------------------------

    order.status = 'Processing'

    // ---------------------------------------------
    // 13. Save order
    // ---------------------------------------------

    await order.save()

    // ---------------------------------------------
    // 14. Send response
    // ---------------------------------------------

    res.status(200).json({
      success: true,
      message:
        'Payment verified successfully',
      order,
    })
  } catch (error) {
    console.error(
      'Verify payment error:',
      error
    )

    res.status(500).json({
      message: error.message,
    })
  }
}