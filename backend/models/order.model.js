import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    // ─────────────────────────────
    // WHO PLACED THE ORDER
    // ─────────────────────────────

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─────────────────────────────
    // ORDERED ITEMS
    // ─────────────────────────────

    items: [
      {
        // Reference to the watch
        watch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Watch',
        },

        // Snapshot of product information
        name: {
          type: String,
          required: true,
        },

        brand: {
          type: String,
          required: true,
        },

        // Original price before discount
        originalPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        // Discounted price
        discountPrice: {
          type: Number,
          default: null,
          min: 0,
        },

        // Actual price customer paid
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          default: '',
        },
      },
    ],

    // ─────────────────────────────
    // DELIVERY ADDRESS
    // ─────────────────────────────

    deliveryAddress: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // ─────────────────────────────
    // PAYMENT INFO
    // ─────────────────────────────

    payment: {
      method: {
        type: String,
        default: 'Razorpay',
      },

      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },

      razorpayOrderId: {
        type: String,
        default: '',
      },

      razorpayPaymentId: {
        type: String,
        default: '',
      },
    },

    // ─────────────────────────────
    // PRICE SUMMARY
    // ─────────────────────────────

    // Total before discounts
    originalTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Total amount saved
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Final amount customer has to pay
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // ─────────────────────────────
    // ORDER STATUS
    // ─────────────────────────────

    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order