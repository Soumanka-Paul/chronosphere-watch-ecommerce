import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    // ── WHO WROTE THE REVIEW ──
    // Reference to User collection
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // ── WHICH WATCH IS BEING REVIEWED ──
    // Reference to Watch collection
    watch: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Watch',
      required: true,
    },

    // ── RATING ──
    // 1 to 5 stars
    rating: {
      type:     Number,
      required: [true, 'Rating is required'],
      min:      [1, 'Rating must be at least 1'],
      max:      [5, 'Rating cannot exceed 5'],
    },

    // ── COMMENT ──
    comment: {
      type:     String,
      required: [true, 'Review comment is required'],
      trim:     true,
    },

    // ── USER NAME ──
  
    userName: {
      type:    String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// ── UNIQUE REVIEW ──
reviewSchema.index(
  { user: 1, watch: 1 },
  { unique: true }
)

const Review = mongoose.model('Review', reviewSchema)
export default Review