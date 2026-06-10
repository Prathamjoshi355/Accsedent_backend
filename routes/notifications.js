const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Event = require('../models/Event')
const { authMiddleware } = require('../utils/jwt')
const { sendMail } = require('../utils/mailer')
const { triggerEmergency } = require('../utils/emergency')

router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const to = user.email
    if (!to) return res.status(400).json({ error: 'No user email configured' })
    await sendMail({
      to,
      subject: 'Accident Guardian - Test Email',
      text: `Hello ${user.name || user.email},\n\nThis is a test message from Accident Guardian. Your email settings are configured correctly.`
    })
    await Event.create({ user: user._id, type: 'TEST_EMAIL_SENT', payload: { to, timestamp: new Date().toISOString() } })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send test email' })
  }
})

router.post('/send-alert', authMiddleware, async (req, res) => {
  try {
    const { lat, lng, alertText = 'Accident detected' } = req.body || {}
    if (lat == null || lng == null) return res.status(400).json({ error: 'Missing GPS coordinates' })
    const user = await User.findById(req.user.id)
    const contacts = user.contacts || []
    const payload = await triggerEmergency(user, contacts, lat, lng, alertText)
    await Event.create({ user: user._id, type: 'ALERT_SENT', payload })
    res.json({ ok: true, payload })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send alert email' })
  }
})

module.exports = router
