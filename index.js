const config = require('./server/utils/config')
const app = require('./app')

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${config.PORT}.`)
  // eslint-disable-next-line no-console
  console.log('pull request for fullstackopen exercise 11.21')
})