import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 6,
      select:    false,
    },
    resetPasswordToken: 
        { type: String, 
         default: null, }, 

    resetPasswordExpire: { type: Date, default: null, },

    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user',
    },

    avatar: {
      type:    String,
      default: '',
    },

    // ── CART ──
    cart: [
      {
        watchId:  { type: String, required: true },
        name:     { type: String, required: true },
        brand:    { type: String, default:  ''   },
        price:    { type: Number, required: true },
        image:    { type: String, default:  ''   },
        quantity: { type: Number, default:  1    },
      }
    ],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
export default User