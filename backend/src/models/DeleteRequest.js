const mongoose = require('mongoose')

const deleteRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    // Denormalized snapshot info, so the request still displays sensibly even
    // if the order is later deleted/changed.
    orderNumber: { type: String, required: true },
    orderCustomer: { type: String },

    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedByName: { type: String, required: true },
    reason: { type: String, trim: true, default: '' },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedByName: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
)

module.exports = mongoose.model('DeleteRequest', deleteRequestSchema)
