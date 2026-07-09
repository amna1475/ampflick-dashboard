const mongoose = require('mongoose')

// A single document in this collection tracks "what's the last order number used".
// Using findOneAndUpdate with $inc makes the increment atomic — safe even if
// multiple orders are being created at the same time.
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 20000 }, // starts well above the mock data's #10248-#10255 range, avoiding ID collisions
})

const Counter = mongoose.model('Counter', counterSchema)

async function nextOrderNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  )
  return `#${counter.value}`
}

module.exports = { Counter, nextOrderNumber }