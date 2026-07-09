const User = require('../models/User')
const { generateToken } = require('../middleware/auth')

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // .select('+password') because the schema hides password by default
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const token = generateToken(user._id)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me — returns the currently logged-in user (used to restore a session on page refresh)
async function getMe(req, res) {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  })
}

module.exports = { login, getMe }
