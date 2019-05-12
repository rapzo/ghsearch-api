// tests need some love
process.env.GITHUB_API_TOKEN = 'xxx'

const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const got = require('got')
const nock = require('nock')
const sinon = require('sinon')
const {GraphQLClient} = require('graphql-request')
const app = require('.')
const {send} = micro

const client = new GraphQLClient('http://localhost')

test('/', async t => {
  const service = micro(app)
  const url = await listen(service)

  try {
    await got(url)
  } catch ({statusCode}) {
    t.deepEqual(statusCode, 404)
    service.close()
  }
})

test('/search', async t => {
  const service = micro(app)
  const url = await listen(service)

  try {
    await got(`${url}/search`)
  } catch ({statusCode}) {
    t.deepEqual(statusCode, 404)
    service.close()
  }
})

test('/search?q=something', async t => {
  const service = micro(app)
  const url = await listen(service)

  const {statusCode, body} = await got(`${url}/search?q=something`)

  t.deepEqual(statusCode, 200)
  t.is(body.length > 0, true)

  service.close()
})
