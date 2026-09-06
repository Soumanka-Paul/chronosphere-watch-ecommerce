import express from 'express'
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/payment.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// Both routes are private
router.post('/order',  protect, createPaymentOrder)
router.post('/verify', protect, verifyPayment)

export default router