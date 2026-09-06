const adminOnly = (req, res, next) => {

  // req.user is set by protect middleware
  // Check if user role is admin
  if (req.user && req.user.role === 'admin') {
    next() // is admin → allow
  } else {
    res.status(403).json({ message: 'Admin access only' })
  }
}

export default adminOnly;