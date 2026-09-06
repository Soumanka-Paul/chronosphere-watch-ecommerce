import express from 'express'
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser,
} from '../controllers/admin.controller.js'
import protect   from '../middleware/auth.middleware.js'
import adminOnly from '../middleware/admin.middleware.js'

const router = express.Router()

// All admin routes need:
// 1. protect   → must be logged in
// 2. adminOnly → must be admin role

router.get('/stats',          protect, adminOnly, getDashboardStats)
router.get('/orders',         protect, adminOnly, getAllOrders)
router.put('/orders/:id',     protect, adminOnly, updateOrderStatus)
router.get('/users',          protect, adminOnly, getAllUsers)
router.delete('/users/:id',   protect, adminOnly, deleteUser)

export default router