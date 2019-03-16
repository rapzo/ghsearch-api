const micro = require('micro')
const app = require('.')

const service = micro(app)

process.on('SIGINT', () => {
  console.log("shutting down")

  service.close()
  process.exit()
})

service.listen(process.env.PORT || 3000)
