const config = require('./server/utils/config')
const logger = require('./server/utils/logger')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./server/controllers/blogs')
const usersRouter = require('./server/controllers/users')
const { requestLogger, unknownEndpoint, errorHandler } = require('./server/utils/middleware')
const loginRouter = require('./server/controllers/login')
const path = require('path')
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
  const testingRouter = require('./server/controllers/testing')
  app.use('/api/testing', testingRouter)
}

if (process.env.NODE_ENV === 'production') {
  const BUILD_PATH = path.resolve(__dirname, './build')
  const INDEX_PATH = path.resolve(BUILD_PATH, 'index.html')

  app.use(express.static(BUILD_PATH))
  app.get('*', (req, res) => res.sendFile(INDEX_PATH))
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app