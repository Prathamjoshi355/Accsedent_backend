const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { authMiddleware } = require('../utils/jwt')

router.get('/', authMiddleware, async (req,res)=>{
  const user = await User.findById(req.user.id)
  res.json({ ok:true, contacts: user.contacts || [] })
})

router.post('/add', authMiddleware, async (req,res)=>{
  const { name, relationship, email, phone } = req.body || {}
  const user = await User.findById(req.user.id)
  user.contacts.push({ name, relationship, email, phone })
  await user.save()
  res.json({ ok:true, contacts: user.contacts })
})

router.post('/update/:idx', authMiddleware, async (req,res)=>{
  const idx = Number(req.params.idx)
  const user = await User.findById(req.user.id)
  if(!user) return res.status(404).json({ error:'User not found' })
  user.contacts[idx] = { ...user.contacts[idx].toObject(), ...req.body }
  await user.save()
  res.json({ ok:true, contacts: user.contacts })
})

router.post('/delete/:idx', authMiddleware, async (req,res)=>{
  const idx = Number(req.params.idx)
  const user = await User.findById(req.user.id)
  user.contacts.splice(idx,1)
  await user.save()
  res.json({ ok:true, contacts: user.contacts })
})

module.exports = router
