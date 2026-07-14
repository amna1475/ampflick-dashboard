const mongoose = require('mongoose')
const { nextOrderNumber } = require('./Counter')

const orderSchema = new mongoose.Schema(
  {
    // Human-friendly order number, e.g. "#10248" — auto-generated if not provided
    orderNumber: { type: String, unique: true },

    customer: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true },
    product: { type: String, trim: true },

    amount: { type: Number, required: true, min: 0 },

    courier: {
      type: String,
      enum: ['TCS', 'Leopard', 'M&P', 'Trax'],
      default: 'TCS',
    },
    status: {
      type: String,
      enum: ['Processing', 'In Transit', 'Delivered', 'Returned', 'Cancelled'],
      default: 'Processing',
    },
    payment: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    method: {
      type: String,
      enum: ['Easypaisa', 'JazzCash', 'Bank Transfer', 'COD'],
      default: 'COD',
    },
    tracking: { type: String, trim: true, default: '—' },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
)

// Auto-generate a friendly order number before saving, if one wasn't provided
orderSchema.pre('save', async function (next) {
  if (this.orderNumber) return next()
  this.orderNumber = await nextOrderNumber()
  next()
})

module.exports = mongoose.model('Order', orderSchema)