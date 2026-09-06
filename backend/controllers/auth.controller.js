import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from '../models/user.model.js'

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  )
}

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}

const sendResetEmail = async (user, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"ChronoSphere" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'ChronoSphere - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background: #f9fafb;">
        <div style="background: white; padding: 35px; border-radius: 20px; border: 1px solid #eeeeee;">
          <div style="text-align: center;">
            <div style="display: inline-block; background: #000; color: #fff; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; font-size: 22px;">
              C
            </div>

            <h1 style="font-family: Georgia, serif; color: #111; margin-top: 20px;">
              Reset Your Password
            </h1>

            <p style="color: #666; line-height: 1.6;">
              Hello ${user.name},
            </p>

            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your ChronoSphere account password.
            </p>

            <a
              href="${resetUrl}"
              style="display: inline-block; margin: 20px 0; padding: 14px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 30px; font-weight: bold;"
            >
              Reset Password
            </a>

            <p style="color: #999; font-size: 13px; line-height: 1.6;">
              This link will expire in 15 minutes.
            </p>

            <p style="color: #999; font-size: 13px; line-height: 1.6;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all fields',
      })
    }

    const exists = await User.findOne({ email })

    if (exists) {
      return res.status(400).json({
        message: 'Email already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    sendToken(user, 201, res)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please fill all fields',
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    sendToken(user, 200, res)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getme = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Please provide your email address',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, a reset link has been sent',
      })
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString('hex')

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000

    await user.save({
      validateBeforeSave: false,
    })

    const clientUrl =
      process.env.CLIENT_URL || 'http://localhost:5173'

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`

    try {
      await sendResetEmail(user, resetUrl)

      return res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email',
      })
    } catch (emailError) {
      user.resetPasswordToken = null
      user.resetPasswordExpire = null

      await user.save({
        validateBeforeSave: false,
      })

      console.error(
        'Password reset email error:',
        emailError
      )

      return res.status(500).json({
        message: 'Unable to send password reset email',
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        message: 'Please provide a new password',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      })
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    }).select('+password')

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired password reset token',
      })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpire = null

    await user.save()

    res.status(200).json({
      success: true,
      message:
        'Password reset successful. You can now login with your new password.',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}