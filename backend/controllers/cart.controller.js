import User from '../models/user.model.js'

// ─────────────────────────────────────
// NOTE: We store cart in User model
// So we need to add cart field
// to user.model.js first
// ─────────────────────────────────────

// ─────────────────────────────────────
// GET CART
// GET /api/cart
// Private
// ─────────────────────────────────────
export const getCart = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)

    res.status(200).json({
      success: true,
      cart:    user.cart,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// ADD ITEM TO CART
// POST /api/cart
// Private
// ─────────────────────────────────────
export const addToCart = async (req, res) => {
  try {

    const { watchId, name, brand, price, image, quantity } = req.body

    // Check required fields
    if (!watchId || !name || !price) {
      return res.status(400).json({
        message: 'watchId, name and price are required'
      })
    }

    const user = await User.findById(req.user._id)

    // Check if item already in cart
    const existingItem = user.cart.find(
      (item) => item.watchId.toString() === watchId
    )

    if (existingItem) {
      // Item exists → increase quantity
      existingItem.quantity += 1
    } else {
      // New item → push to cart
      user.cart.push({
        watchId,
        name,
        brand,
        price,
        image,
        quantity: quantity || 1,
      })
    }

    // Save updated user
    await user.save()

    res.status(200).json({
      success: true,
      cart:    user.cart,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// UPDATE ITEM QUANTITY
// PUT /api/cart/:watchId
// Private
// ─────────────────────────────────────
export const updateCartItem = async (req, res) => {
  try {

    const { quantity } = req.body
    const { watchId }  = req.params

    const user = await User.findById(req.user._id)

    // Find item in cart
    const item = user.cart.find(
      (item) => item.watchId.toString() === watchId
    )

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    // If quantity is 0 → remove item
    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.watchId.toString() !== watchId
      )
    } else {
      // Update quantity
      item.quantity = quantity
    }

    await user.save()

    res.status(200).json({
      success: true,
      cart:    user.cart,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// REMOVE ITEM FROM CART
// DELETE /api/cart/:watchId
// Private
// ─────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {

    const { watchId } = req.params

    const user = await User.findById(req.user._id)

    // Filter out the item with matching watchId
    user.cart = user.cart.filter(
      (item) => item.watchId.toString() !== watchId
    )

    await user.save()

    res.status(200).json({
      success: true,
      cart:    user.cart,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────
// CLEAR CART
// DELETE /api/cart
// Private
// ─────────────────────────────────────
export const clearCart = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)

    // Set cart to empty array
    user.cart = []
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart:    [],
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}