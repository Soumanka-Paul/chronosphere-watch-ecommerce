import Wishlist from '../models/wishlist.model.js'

// ─────────────────────────────────────
// GET MY WISHLIST
// GET /api/wishlist
// Private
// ─────────────────────────────────────
export const getWishlist = async (req, res) => {
  try {

    // Find wishlist of logged in user
    // populate('watches') → replaces watch IDs
    // with actual watch data
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('watches')

    // If no wishlist yet → return empty array
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        watches: [],
      })
    }

    res.status(200).json({
      success: true,
      watches: wishlist.watches,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// ADD TO WISHLIST
// POST /api/wishlist/:watchId
// Private
// ─────────────────────────────────────
export const addToWishlist = async (req, res) => {
  try {

    const { watchId } = req.params

    // findOneAndUpdate with upsert
    // If wishlist exists → update it
    // If not → create new one
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { watches: watchId } },
      // $addToSet → adds watchId only if
      // not already in array
      // prevents duplicates
      { new: true, upsert: true }
      // new: true    → return updated document
      // upsert: true → create if not exists
    )

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      wishlist,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:watchId
// Private
// ─────────────────────────────────────
export const removeFromWishlist = async (req, res) => {
  try {

    const { watchId } = req.params

    // $pull → removes watchId from watches array
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { watches: watchId } },
      { new: true }
    )

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      wishlist,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// CLEAR WISHLIST
// DELETE /api/wishlist
// Private
// ─────────────────────────────────────
export const clearWishlist = async (req, res) => {
  try {

    // Set watches array to empty []
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $set: { watches: [] } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      wishlist,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}