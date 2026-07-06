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

// Specific routes before dynamic /:id routes, so "summary" and "import" aren't mistaken for an ID
router.get('/summary', getSummary)
router.post('/import', importOrders)

router.get('/', getOrders)
router.post('/', createOrder)
router.get('/:id', getOrderById)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

module.exports = router
