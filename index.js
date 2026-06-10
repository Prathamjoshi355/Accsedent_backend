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
app.use(cors())
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
