const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Otp = require('../models/Otp')
const User = require('../models/User')
const { sendMail } = require('../utils/mailer')
const { sign } = require('../utils/jwt')

function genCode(){ return Math.floor(100000 + Math.random()*900000).toString() }

router.post('/request-otp', async (req,res)=>{
  const { email, debug } = req.body || {}
  if(!email) return res.status(400).json({ error:'missing email' })
  const code = genCode()
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(code, salt)
  const expires = new Date(Date.now()+5*60*1000)
  await Otp.create({ email, codeHash: hash, expiresAt: expires })

  if (debug) {
    return res.json({ ok:true, debugCode: code })
  }

  try {
    await sendMail({ to: email, subject: 'Your OTP for Accident Guardian', text: `Your login code: ${code} (expires in 5 minutes)` })
  } catch (err) {
    console.error('OTP email error', err)
    return res.status(500).json({ error: 'Unable to send OTP email. Check SMTP configuration.' })
  }

  res.json({ ok:true })
})

router.post('/verify-otp', async (req,res)=>{
  const { email, code } = req.body || {}
  if(!email || !code) return res.status(400).json({ error:'missing fields' })
  const otp = await Otp.findOne({ email }).sort({ createdAt:-1 })
  if(!otp) return res.status(400).json({ error:'OTP not found' })
  if(otp.expiresAt < new Date()) return res.status(400).json({ error:'OTP expired' })
  const ok = bcrypt.compareSync(code, otp.codeHash)
  if(!ok) return res.status(400).json({ error:'Invalid OTP' })
  // find or create user
  let user = await User.findOne({ email })
  if(!user) user = await User.create({ email })
  const token = sign({ id: user._id, email: user.email })
  res.json({ ok:true, token, user })
})

module.exports = router
