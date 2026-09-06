import express from 'express'
import {
  getReviews,
  addReview,
  deleteReview,
} from '../controllers/review.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// Public → anyone can read reviews
router.get('/:watchId', getReviews)

// Private → must be logged in
router.post('/:watchId',       protect, addReview)
router.delete('/:reviewId',    protect, deleteReview)

export default router