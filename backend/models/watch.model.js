import mongoose from 'mongoose'

const watchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Watch name is required'],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },

    // Original / regular price
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Final selling price after discount
    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (value) {
          if (value === null || value === undefined) {
            return true
          }

          return value < this.price
        },
        message:
          'Discount price must be less than regular price',
      },
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          default: '',
        },
        publicId: {
          type: String,
          default: '',
        },
      },
    ],

    category: {
      type: String,
      default: 'Luxury',
      trim: true,
    },

    stock: {
      type: Number,
      default: 10,
      min: [0, 'Stock cannot be negative'],
    },

    specs: {
      movement: {
        type: String,
        default: '',
      },

      caseDiameter: {
        type: String,
        default: '',
      },

      waterResistance: {
        type: String,
        default: '',
      },

      material: {
        type: String,
        default: '',
      },
    },

    tag: {
      type: String,
      enum: [
        'Bestseller',
        'New',
        'Popular',
        'Limited',
        'Exclusive',
        null,
      ],
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Watch = mongoose.model('Watch', watchSchema)

export default Watch