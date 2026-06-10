const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const { authMiddleware } = require('../utils/jwt')

router.post('/log', authMiddleware, async (req,res)=>{
  const { type, payload } = req.body || {}
  const e = await Event.create({ user: req.user.id, type, payload })
  res.json({ ok:true, event: e })
})

router.get('/', authMiddleware, async (req,res)=>{
  const events = await Event.find({ user: req.user.id }).sort({ createdAt:-1 }).limit(200)
  res.json({ ok:true, events })
})

module.exports = router
