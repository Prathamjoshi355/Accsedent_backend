require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const contactRoutes = require('./routes/contacts')
const eventRoutes = require('./routes/events')
const helpRoutes = require('./routes/help')
const notificationsRoutes = require('./routes/notifications')

const app = express()
const defaultOrigins = [
  'https://accsedent-frontend.vercel.app',
  'http://localhost:5173'
]
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)
const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins])
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ''))) {
      return callback(null, true)
    }
    console.warn(`CORS rejected origin: ${origin}`)
    return callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

const port = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/accident_guardian')
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB error', err))
app.use('/auth', authRoutes)
app.use('/api', notificationsRoutes)
app.use('/api/users', userRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/help', helpRoutes)

app.get('/', (req,res)=> res.json({ok:true}))

app.listen(port, ()=> console.log(`Server listening ${port}`))
