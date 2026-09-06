
import express from 'express'

import {
  register,
  login,
  logout,
  getme,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js'

import protect from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/me', protect, getme)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

export default router

