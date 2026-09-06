import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    // ── WHICH USER ──
    // One wishlist belongs to one user
    // unique: true means one user
    // can only have ONE wishlist document
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },

    // ── SAVED WATCHES ──
    // Array of watch IDs
    // Each item is a reference to Watch collection
    watches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Watch',
      }
    ],
  },
  {
    timestamps: true,
  }
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist