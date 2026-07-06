// Run with: npm run seed
// This connects to your MongoDB Atlas database, clears any existing orders,
// and inserts the same sample data the frontend currently shows as mock data.
// Running this is what actually creates the "ampflick" database and the "orders"
// collection in Atlas — MongoDB creates both automatically on first insert.

require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Order = require('./models/Order')

const sampleOrders = [
  { customer: 'Zainab Malik', email: 'z.malik@email.com', city: 'Lahore', product: 'Wireless Earbuds', amount: 4500, courier: 'TCS', status: 'Delivered', payment: 'Paid', method: 'Easypaisa', tracking: 'TCS-88213' },
  { customer: 'Hamza Ahmed', email: 'hamza.a@outlook.com', city: 'Karachi', product: 'Leather Wallet', amount: 2100, courier: 'Leopard', status: 'In Transit', payment: 'Pending', method: 'COD', tracking: 'LPR-55931' },
  { customer: 'Saira Khan', email: 'saira.k@gmail.com', city: 'Islamabad', product: 'Skincare Bundle', amount: 6900, courier: 'M&P', status: 'Processing', payment: 'Paid', method: 'JazzCash', tracking: 'MNP-10294' },
  { customer: 'Usman Ali', email: 'usman.ali@work.pk', city: 'Faisalabad', product: 'Running Shoes (Size Mismatch)', amount: 5200, courier: 'TCS', status: 'Returned', payment: 'Refunded', method: 'Bank Transfer', tracking: 'TCS-88477' },
  { customer: 'Ayesha Raza', email: 'ayesha.raza@email.com', city: 'Multan', product: 'Kitchen Blender', amount: 8300, courier: 'Trax', status: 'Cancelled', payment: 'Refunded', method: 'COD', tracking: 'TRX-30021' },
  { customer: 'Bilal Chaudhry', email: 'bilal.c@email.com', city: 'Lahore', product: 'Bluetooth Speaker', amount: 3750, courier: 'Leopard', status: 'Delivered', payment: 'Paid', method: 'Easypaisa', tracking: 'LPR-55988' },
  { customer: 'Mahnoor Fatima', email: 'mahnoor.f@email.com', city: 'Karachi', product: 'Yoga Mat', amount: 1890, courier: 'M&P', status: 'Processing', payment: 'Pending', method: 'JazzCash', tracking: 'MNP-10301' },
  { customer: 'Ahsan Tariq', email: 'ahsan.tariq@email.com', city: 'Islamabad', product: 'Office Chair', amount: 14200, courier: 'Trax', status: 'In Transit', payment: 'Paid', method: 'Bank Transfer', tracking: 'TRX-30055' },
]

async function seed() {
  await connectDB()

  console.log('🗑️  Clearing existing orders...')
  await Order.deleteMany({})

  console.log('🌱 Inserting sample orders...')
  const created = await Order.insertMany(sampleOrders)

  console.log(`✅ Done! Inserted ${created.length} orders into the "orders" collection.`)
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message)
  process.exit(1)
})
