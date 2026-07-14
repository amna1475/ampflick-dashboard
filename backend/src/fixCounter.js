// Run once with: node src/fixCounter.js
// Scans all existing orders, finds the highest orderNumber actually in use,
// and resets the Counter to match — so newly created orders never collide
// with numbers that already exist.

require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Order = require('./models/Order')
const { Counter } = require('./models/Counter')

async function fixCounter() {
  await connectDB()

  const orders = await Order.find({}, 'orderNumber')
  let maxNumber = 20000 // never go below our intended safe starting range

  orders.forEach((o) => {
    const match = String(o.orderNumber || '').match(/(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      if (num > maxNumber) maxNumber = num
    }
  })

  const updated = await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $set: { value: maxNumber } },
    { new: true, upsert: true }
  )

  console.log(`✅ Counter resynced. Next order created will be #${updated.value + 1}`)
  console.log(`   (Highest existing order number found: #${maxNumber})`)

  await mongoose.disconnect()
  process.exit(0)
}

fixCounter().catch((err) => {
  console.error('❌ Failed to fix counter:', err.message)
  process.exit(1)
})