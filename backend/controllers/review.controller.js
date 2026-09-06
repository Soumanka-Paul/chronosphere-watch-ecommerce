import Review from '../models/review.model.js'
import Watch from '../models/watch.model.js'
import Order from '../models/order.model.js'

export const getReviews = async (req, res) => {
  try {
    const { watchId } = req.params

    const watch = await Watch.findById(watchId)

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      })
    }

    const reviews = await Review.find({
      watch: watchId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    console.error('Get reviews error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
    })
  }
}

export const addReview = async (req, res) => {
  try {
    const { watchId } = req.params
    const { rating, comment } = req.body

    if (
      rating === undefined ||
      rating === null ||
      rating === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required',
      })
    }

    const numericRating = Number(rating)

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
    }

    if (!Number.isInteger(numericRating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number from 1 to 5',
      })
    }

    if (
      typeof comment !== 'string' ||
      !comment.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Review comment is required',
      })
    }

    const cleanComment = comment.trim()

    const watch = await Watch.findById(watchId)

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      })
    }

    const paidOrder = await Order.findOne({
      user: req.user._id,
      'payment.status': 'paid',
      'items.watch': watchId,
    })

    if (!paidOrder) {
      return res.status(403).json({
        success: false,
        message: 'You can review this watch only after purchasing it',
      })
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      watch: watchId,
    })

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this watch',
      })
    }

    const review = await Review.create({
      user: req.user._id,
      watch: watchId,
      rating: numericRating,
      comment: cleanComment,
      userName: req.user.name,
    })

    const allReviews = await Review.find({
      watch: watchId,
    })

    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )

    const averageRating =
      totalRating / allReviews.length

    await Watch.findByIdAndUpdate(watchId, {
      rating: Number(averageRating.toFixed(1)),
      numReviews: allReviews.length,
    })

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    })
  } catch (error) {
    console.error('Add review error:', error)

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this watch',
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(', '),
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add review',
    })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(
      req.params.reviewId
    )

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      })
    }

    const watchId = review.watch

    await Review.findByIdAndDelete(
      req.params.reviewId
    )

    const allReviews = await Review.find({
      watch: watchId,
    })

    if (allReviews.length === 0) {
      await Watch.findByIdAndUpdate(watchId, {
        rating: 0,
        numReviews: 0,
      })
    } else {
      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      )

      const averageRating =
        totalRating / allReviews.length

      await Watch.findByIdAndUpdate(watchId, {
        rating: Number(averageRating.toFixed(1)),
        numReviews: allReviews.length,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Delete review error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    })
  }
}