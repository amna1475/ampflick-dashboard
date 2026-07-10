const DeleteRequest = require('../models/DeleteRequest')
const Order = require('../models/Order')

// POST /api/delete-requests — any logged-in user asks to delete an order.
// Nothing is actually deleted here — this just creates a pending request.
async function createRequest(req, res, next) {
  try {
    const { orderId, reason } = req.body
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required.' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    // Avoid piling up duplicate pending requests for the same order.
    const existingPending = await DeleteRequest.findOne({ order: orderId, status: 'Pending' })
    if (existingPending) {
      return res.status(400).json({ message: 'A deletion request for this order is already pending approval.' })
    }

    const request = await DeleteRequest.create({
      order: order._id,
      orderNumber: order.orderNumber,
      orderCustomer: order.customer,
      requestedBy: req.user._id,
      requestedByName: req.user.name,
      reason: reason || '',
    })

    res.status(201).json(request)
  } catch (err) {
    next(err)
  }
}

// GET /api/delete-requests — Admin only. Lists requests (defaults to pending ones).
async function getRequests(req, res, next) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const requests = await DeleteRequest.find(filter).sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    next(err)
  }
}

// PUT /api/delete-requests/:id/approve — Admin only. Actually deletes the order.
async function approveRequest(req, res, next) {
  try {
    const request = await DeleteRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Request not found.' })
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `This request was already ${request.status.toLowerCase()}.` })
    }

    await Order.findByIdAndDelete(request.order)

    request.status = 'Approved'
    request.resolvedBy = req.user._id
    request.resolvedByName = req.user.name
    request.resolvedAt = new Date()
    await request.save()

    res.json(request)
  } catch (err) {
    next(err)
  }
}

// PUT /api/delete-requests/:id/reject — Admin only. Order is left untouched.
async function rejectRequest(req, res, next) {
  try {
    const request = await DeleteRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Request not found.' })
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `This request was already ${request.status.toLowerCase()}.` })
    }

    request.status = 'Rejected'
    request.resolvedBy = req.user._id
    request.resolvedByName = req.user.name
    request.resolvedAt = new Date()
    await request.save()

    res.json(request)
  } catch (err) {
    next(err)
  }
}

module.exports = { createRequest, getRequests, approveRequest, rejectRequest }
