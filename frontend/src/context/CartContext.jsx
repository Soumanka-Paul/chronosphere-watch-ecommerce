
import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const { user, isLoggedIn } = useAuth()

  // ============================================
  // USER-SPECIFIC CART KEY
  // ============================================

  const cartKey = user?._id
    ? `cart_${user._id}`
    : null


  // ============================================
  // CART STATE
  // ============================================

  const [cart, setCart] = useState([])


  // ============================================
  // LOAD USER CART
  // ============================================

  useEffect(() => {

    // User logged out
    if (!isLoggedIn || !cartKey) {
      setCart([])
      return
    }

    try {

      const saved = localStorage.getItem(cartKey)

      if (!saved) {
        setCart([])
        return
      }

      const parsedCart = JSON.parse(saved)

      if (!Array.isArray(parsedCart)) {
        setCart([])
        return
      }

      setCart(parsedCart)

    } catch (error) {

      console.error('Cart loading error:', error)

      setCart([])

    }

  }, [isLoggedIn, cartKey])


  // ============================================
  // SAVE USER CART
  // ============================================

  useEffect(() => {

    if (!isLoggedIn || !cartKey) {
      return
    }

    localStorage.setItem(
      cartKey,
      JSON.stringify(cart)
    )

  }, [cart, isLoggedIn, cartKey])


  // ============================================
  // ADD ITEM TO CART
  // LOGIN REQUIRED
  // ============================================

  const addItem = (item) => {

    if (!isLoggedIn) {

      toast.error(
        'Please login to add items to cart'
      )

      return false
    }

    setCart((prev) => {

      const alreadyInCart = prev.find(
        (p) => p.id === item.id
      )


      // ========================================
      // ITEM ALREADY IN CART
      // ========================================

      if (alreadyInCart) {

        // Check stock limit

        if (
          item.stock !== undefined &&
          alreadyInCart.quantity >= Number(item.stock)
        ) {

          toast.error(
            'Maximum available stock reached'
          )

          return prev
        }

        toast.success(
          'Cart quantity increased'
        )

        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + 1,
              }
            : p
        )
      }


      // ========================================
      // PRICE CALCULATION
      // ========================================

      const originalPrice = Number(
        item.originalPrice ??
        item.price ??
        0
      )

      const discountPrice =
        item.discountPrice !== null &&
        item.discountPrice !== undefined &&
        Number(item.discountPrice) > 0 &&
        Number(item.discountPrice) < originalPrice
          ? Number(item.discountPrice)
          : null

      const sellingPrice =
        discountPrice ?? originalPrice


      // ========================================
      // ADD NEW ITEM
      // ========================================

      toast.success(
        'Added to cart'
      )

      return [
        ...prev,

        {
          ...item,
          id: item.id,
          price: sellingPrice,
          originalPrice,
          discountPrice,
          quantity: 1,
        },
      ]

    })

    return true
  }


  // ============================================
  // INCREMENT
  // ============================================

  const increment = (id) => {

    if (!isLoggedIn) {
      return
    }

    setCart((prev) =>
      prev.map((item) => {

        if (item.id !== id) {
          return item
        }

        // Check stock

        if (
          item.stock !== undefined &&
          item.quantity >= Number(item.stock)
        ) {

          toast.error(
            'Maximum available stock reached'
          )

          return item
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        }

      })
    )
  }


  // ============================================
  // DECREMENT
  // ============================================

  const decrement = (id) => {

    if (!isLoggedIn) {
      return
    }

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }


  // ============================================
  // REMOVE ITEM
  // ============================================

  const removeItem = (id) => {

    if (!isLoggedIn) {
      return
    }

    setCart((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    )
  }


  // ============================================
  // CLEAR CART
  // ============================================

  const clearCart = () => {
    setCart([])
  }


  // ============================================
  // PARSE PRICE
  // ============================================

  const parsePrice = (price) => {

    if (typeof price === 'number') {
      return price
    }

    if (!price) {
      return 0
    }

    const cleaned = String(price)
      .replace(/[^0-9.]/g, '')

    return parseFloat(cleaned) || 0
  }


  // ============================================
  // TOTAL ITEMS
  // ============================================

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  )


  // ============================================
  // TOTAL PRICE
  // ============================================

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      parsePrice(item.price) *
        Number(item.quantity || 0),
    0
  )


  // ============================================
  // TOTAL ORIGINAL PRICE
  // ============================================

  const totalOriginalPrice = cart.reduce(
    (sum, item) => {

      const originalPrice = parsePrice(
        item.originalPrice ??
        item.price
      )

      return (
        sum +
        originalPrice *
          Number(item.quantity || 0)
      )

    },
    0
  )


  // ============================================
  // TOTAL DISCOUNT
  // ============================================

  const totalDiscount = Math.max(
    0,
    totalOriginalPrice - totalPrice
  )


  // ============================================
  // PROVIDER
  // ============================================

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        totalOriginalPrice,
        totalDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}


export const useCart = () =>
  useContext(CartContext)

