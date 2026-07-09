// Run with: npm run seed:admin
// Creates the very first Admin account so someone can actually log in.
// After this, that Admin can create all other users from the Users page in the app.

require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User = require('./models/User')

// Edit these before running, or override via environment variables.
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Asjad Haroon'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'asjad@ampflick.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123'

async function seedAdmin() {
  await connectDB()

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })
  if (existing) {
    console.log(`ℹ️  A user with email "${ADMIN_EMAIL}" already exists — no changes made.`)
    await mongoose.disconnect()
    process.exit(0)
  }

  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // gets hashed automatically by the User model's pre-save hook
    role: 'Admin',
  })

  console.log('✅ Admin account created:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: ${ADMIN_PASSWORD} (change this after logging in for the first time)`)

  await mongoose.disconnect()
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('❌ Failed to create admin account:', err.message)
  process.exit(1)
})
