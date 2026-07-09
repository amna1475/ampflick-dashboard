const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generates a signed token when a user logs in. Expires in 7 days —
// after that they'll need to log in again.
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Runs on every protected route. Reads the token from the
// "Authorization: Bearer <token>" header, verifies it, and attaches the
// matching user to req.user so later handlers know who's making the request.
async function protect(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not logged in. Please sign in and try again.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'This account no longer exists.' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }
}

// Runs after `protect` on routes that only Admins should be able to use
// (e.g. deleting an order, managing other users).
function requireAdmin(req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only Admins can do this.' })
  }
  next()
}

module.exports = { protect, requireAdmin, generateToken }
