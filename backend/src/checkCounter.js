// Run with: node src/checkCounter.js
// This doesn't change anything — it just prints what's actually in your
// database right now, so we can see exactly why the duplicate error keeps happening.

require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Order = require('./models/Order')
const { Counter } = require('./models/Counter')

async function check() {
  await connectDB()

  console.log('\n--- Counter document ---')
  const counter = await Counter.findOne({ name: 'orderNumber' })
  if (!counter) {
    console.log('No Counter document exists yet.')
  } else {
    console.log(`name: ${counter.name}, value: ${counter.value}  (next order would be #${counter.value + 1})`)
  }

  console.log('\n--- All orders currently in the database ---')
  const orders = await Order.find({}, 'orderNumber customer createdAt').sort({ orderNumber: 1 })
  console.log(`Total orders: ${orders.length}`)
  orders.forEach((o) => {
    console.log(`${o.orderNumber}   ${o.customer}   ${o.createdAt?.toISOString()}`)
  })

  console.log('\n--- Checking for duplicate orderNumbers ---')
  const seen = {}
  let foundDuplicate = false
  orders.forEach((o) => {
    seen[o.orderNumber] = (seen[o.orderNumber] || 0) + 1
  })
  Object.entries(seen).forEach(([num, count]) => {
    if (count > 1) {
      foundDuplicate = true
      console.log(`⚠️  ${num} appears ${count} times!`)
    }
  })
  if (!foundDuplicate) console.log('No duplicates found among existing orders.')

  await mongoose.disconnect()
  process.exit(0)
}

check().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})