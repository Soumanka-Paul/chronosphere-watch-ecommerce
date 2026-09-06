import express from 'express'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All wishlist routes are private
router.get('/',            protect, getWishlist)
router.post('/:watchId',   protect, addToWishlist)
router.delete('/:watchId', protect, removeFromWishlist)
router.delete('/',         protect, clearWishlist)

export default router;