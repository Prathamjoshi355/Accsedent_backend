const mongoose = require('mongoose')
const OtpSchema = new mongoose.Schema({
  email: String,
  codeHash: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
})
module.exports = mongoose.model('Otp', OtpSchema)
