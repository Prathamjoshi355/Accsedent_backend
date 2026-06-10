const mongoose = require('mongoose')
const ContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  email: String,
  phone: String
})

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  bloodGroup: String,
  address: String,
  contacts: [ContactSchema],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
