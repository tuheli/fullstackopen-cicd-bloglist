const config = require('./src/utils/config')
const app = require('./app')

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${config.PORT}.`)
})