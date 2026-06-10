const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'secret'
function sign(payload, expires='7d'){ return jwt.sign(payload, secret, { expiresIn: expires }) }
function verify(token){ try { return jwt.verify(token, secret) } catch(e){ return null } }
function authMiddleware(req,res,next){ const h = req.headers.authorization; if(!h) return res.status(401).json({error:'Unauthorized'}); const p = h.split(' ')[1]; const decoded = verify(p); if(!decoded) return res.status(401).json({error:'Invalid token'}); req.user = decoded; next() }
module.exports = { sign, verify, authMiddleware }
