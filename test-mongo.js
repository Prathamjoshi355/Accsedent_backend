require('dotenv').config()
const mongoose = require('mongoose')

console.log('Testing MongoDB connection...')
console.log('URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'Not set')

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/accident_guardian', {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✓ MongoDB Connected Successfully')
    mongoose.disconnect()
    process.exit(0)
  })
  .catch(err => {
    console.log('✗ MongoDB Connection Failed')
    console.log('Error:', err.message)
    process.exit(1)
  })
