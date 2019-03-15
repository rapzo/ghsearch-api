const url = require('url')
const querystring = require('querystring')
const {send} = require('micro')
const Octokit = require('@octokit/rest')
const {ApiError} = require('./error')

const TOKEN = process.env.GITHUB_API_TOKEN

const octokit = new Octokit({
  // see "Authentication" section below
  auth: `token ${TOKEN}`,
})

const handleSearch = async ({q, page = 0, limit = 10}) => {
  const {data} = await octokit.search.users({
    q: `${q}+type:users`,
  })
  const {items} = data
  // should do something with headers?

  return {items}
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

module.exports = handleError(async (req, res) => {
  if (req.method !== 'GET') throw new ApiError(404)

  const {pathname, search} = url.parse(req.url)

  if (!pathname) throw new ApiError(404, 'Bad pathname')

  if (!search) throw new ApiError(
    404,
    'Missing search conditions'
  )

  const query = querystring.parse(search.substr(1))

  if (!query.q) throw new ApiError(404, 'Missing search conditions')

  if (pathname === '/search') return send(
    res,
    200,
    await handleSearch(query)
  )

  throw new ApiError(404)
})
