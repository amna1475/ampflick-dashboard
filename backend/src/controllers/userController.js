const User = require('../models/User')

// GET /api/users — Admin only
async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: 1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// POST /api/users — Admin only. Grants a new user access to the portal.
async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already has access.' })
    }

    const user = await User.create({ name, email, password, role: role || 'User' })
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/:id/role — Admin only. Changes a user's role.
async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    if (!['Admin', 'User'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "Admin" or "User".' })
    }

    // Don't allow demoting the last remaining Admin — the portal would end up with no admin at all.
    if (role === 'User') {
      const target = await User.findById(req.params.id)
      if (target?.role === 'Admin') {
        const adminCount = await User.countDocuments({ role: 'Admin' })
        if (adminCount <= 1) {
          return res.status(400).json({ message: "Can't change this — there must be at least one Admin." })
        }
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/users/:id — Admin only. Revokes a user's access entirely.
async function deleteUser(req, res, next) {
  try {
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ message: "You can't remove your own access." })
    }

    const target = await User.findById(req.params.id)
    if (!target) return res.status(404).json({ message: 'User not found.' })

    if (target.role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin' })
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Can't remove the last remaining Admin." })
      }
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User access revoked.', id: req.params.id })
  } catch (err) {
    next(err)
  }
}

module.exports = { getUsers, createUser, updateUserRole, deleteUser }
