const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUserRole, deleteUser } = require('../controllers/userController')
const { protect, requireAdmin } = require('../middleware/auth')

// Every route here requires you to be logged in AND an Admin
router.use(protect, requireAdmin)

router.get('/', getUsers)
router.post('/', createUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id', deleteUser)

module.exports = router
