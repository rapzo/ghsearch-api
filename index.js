const url = require('url')
const querystring = require('querystring')
const {send} = require('micro')
const cors = require('micro-cors')
const Octokit = require('@octokit/rest')

const TOKEN = process.env.GITHUB_API_TOKEN

const ApiError = class extends Error {
  constructor(statusCode, message) {
    super(message)

    this.statusCode = statusCode
  }
}

const octokit = new Octokit({
  // see "Authentication" section below
  auth: `token ${TOKEN}`,
})

const handleSearch = async ({q, page = 0, perPage = 10}) => {
  const {data} = await octokit.search.users({
    q,
    page,
    per_page: perPage
  })
  // should do something with headers?

  return data
}

const handleError = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (error) {
    console.log(error.statusCode, error.message, error.stack)

    send(
      res,
      error instanceof ApiError ? error.statusCode : 500,
      error.message.length > 0 ? {error: error.message} : null
    )
  }
}

const handleCors = cors({
  allowMethods: ['GET'],
  origin: [
    // 'localhost:4200',
    '*',
  ]
})

module.exports = handleCors(handleError(async (req, res) => {
  if (req.method !== 'GET') throw new ApiError(404)

  const {pathname, search} = url.parse(req.url)

  // load balancer heartbeat
  if (pathname === '/hb') return send(res, 200)

  if (pathname === '/search') {
    if (!search) throw new ApiError(
      404,
      'Missing search conditions'
    )
  
    const query = querystring.parse(search.substr(1))
  
    if (!query.q) throw new ApiError(404, 'Missing search conditions')

    return send(
      res,
      200,
      await handleSearch(query)
    )
  }

  send(res, 200)
}))
