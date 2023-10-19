const healthCheckRouter = require('express').Router()

healthCheckRouter.get('/', async (request, response) => {
  return response
    .status(200)
    .send('ok')
})

module.exports = healthCheckRouter