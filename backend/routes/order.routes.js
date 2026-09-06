import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/order.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All order routes are private
// User must be logged in
router.post('/',           protect, placeOrder)
router.get('/',            protect, getMyOrders)
router.get('/:id',         protect, getOrderById)
router.put('/:id/cancel',  protect, cancelOrder)

export default router;