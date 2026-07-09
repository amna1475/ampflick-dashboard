const express = require('express')
const router = express.Router()
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  importOrders,
  getSummary,
} = require('../controllers/orderController')
const { protect, requireAdmin } = require('../middleware/auth')

// Every order route requires being logged in
router.use(protect)

// Specific routes before dynamic /:id routes, so "summary" and "import" aren't mistaken for an ID
router.get('/summary', getSummary)
router.post('/import', importOrders) // any logged-in user can bulk-add via CSV

router.get('/', getOrders)
router.post('/', createOrder) // Admin + User can add
router.get('/:id', getOrderById)
router.put('/:id', updateOrder) // Admin + User can edit
router.delete('/:id', requireAdmin, deleteOrder) // Admin only can delete

module.exports = router
