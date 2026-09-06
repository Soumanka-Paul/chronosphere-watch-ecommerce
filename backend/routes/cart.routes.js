import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All cart routes are private
// User must be logged in

router.get('/',            protect, getCart)         // get my cart
router.post('/',           protect, addToCart)        // add item
router.put('/:watchId',    protect, updateCartItem)   // update quantity
router.delete('/:watchId', protect, removeFromCart)   // remove one item
router.delete('/',         protect, clearCart)        // clear all

export default router