const mongoose = require('mongoose')
const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  payload: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Event', EventSchema)
