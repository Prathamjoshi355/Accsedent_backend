const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { authMiddleware } = require('../utils/jwt')

router.get('/me', authMiddleware, async (req,res)=>{
  const user = await User.findById(req.user.id)
  res.json({ ok:true, user })
})

router.post('/update', authMiddleware, async (req,res)=>{
  const data = req.body || {}
  const user = await User.findByIdAndUpdate(req.user.id, data, { new:true, upsert:true })
  res.json({ ok:true, user })
})

module.exports = router
