const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const app = express()

mongoose.set('strictQuery', false)
mongoose.set('bufferTimeoutMS', 30000)

const url = config.MONGODB_URI
logger.info(`Connecting to ${url}.`)

mongoose
  .connect(url)
  .then(() => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error('Connection error', error.message))

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app