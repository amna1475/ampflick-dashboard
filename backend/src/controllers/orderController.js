const Order = require('../models/Order')

// GET /api/orders
async function getOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    next(err)
  }
}

// POST /api/orders
async function createOrder(req, res, next) {
  try {
    const order = await Order.create(req.body)
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

// PUT /api/orders/:id
async function updateOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/orders/:id
async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ message: 'Order deleted', id: req.params.id })
  } catch (err) {
    next(err)
  }
}

// POST /api/orders/import — bulk insert, used by the CSV import feature
async function importOrders(req, res, next) {
  try {
    const { orders } = req.body
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: 'Expected a non-empty "orders" array' })
    }
    const created = await Order.insertMany(orders, { ordered: false })
    res.status(201).json({ message: `Imported ${created.length} orders`, count: created.length })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/summary — powers the KPI cards
async function getSummary(req, res, next) {
  try {
    const [totals] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $in: ['$status', ['Processing', 'In Transit']] }, 1, 0] } },
          returned: { $sum: { $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
          totalRevenue: { $sum: '$amount' },
          paymentsReceived: { $sum: { $cond: [{ $eq: ['$payment', 'Paid'] }, '$amount', 0] } },
          pendingPayments: { $sum: { $cond: [{ $eq: ['$payment', 'Pending'] }, '$amount', 0] } },
        },
      },
    ])

    res.json(
      totals || {
        totalOrders: 0,
        delivered: 0,
        pending: 0,
        returned: 0,
        cancelled: 0,
        totalRevenue: 0,
        paymentsReceived: 0,
        pendingPayments: 0,
      }
    )
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  importOrders,
  getSummary,
}
