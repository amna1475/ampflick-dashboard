const express = require('express')
const router = express.Router()
const { createRequest, getRequests, approveRequest, rejectRequest } = require('../controllers/deleteRequestController')
const { protect, requireAdmin } = require('../middleware/auth')

// Must be logged in for all of these
router.use(protect)

// Any logged-in user (typically a non-admin) can submit a request
router.post('/', createRequest)

// Only Admins can view/approve/reject requests
router.get('/', requireAdmin, getRequests)
router.put('/:id/approve', requireAdmin, approveRequest)
router.put('/:id/reject', requireAdmin, rejectRequest)

module.exports = router
