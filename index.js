const url = require('url')
const querystring = require('querystring')
const {send} = require('micro')
const cors = require('micro-cors')
const {GraphQLClient} = require('graphql-request')
const {search} = require('./queries')
const {GITHUB_API_TOKEN} = process.env

if (!GITHUB_API_TOKEN) {
  console.error('Application cannot run without the GITHUB_API_TOKEN')
  process.exit(-1)
}

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `bearer ${GITHUB_API_TOKEN}`,
  },
})

const ApiError = class extends Error {
  constructor(statusCode, message) {
    super(message)

    this.statusCode = statusCode
  }
}

const handleSearch = async ({q, per_page = 10, page}) => {
  const {
    data,
    // @TODO: handle gh errors
    errors,
    // @TODO: handle rate limits
    headers,
    // @TODO: handle status mapping
    status,
  } = await client.rawRequest(search, {
    query: q,
    first: per_page,
    cursor: page,
  })
  const {pageInfo, userCount, edges} = data.search
  const items = edges.map(({node, cursor}) => ({
    ...node,
    followers: node.followers.totalCount,
    following: node.following.totalCount,
    repositories: node.repositories.totalCount,
    starredRepositories: node.repositories.totalCount,
    repositoriesContributedTo: node.repositoriesContributedTo.totalCount,
  }))
  
  return {
    pageInfo,
    userCount,
    items,
  }
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
  
    return send(res, 200, await handleSearch(query))
  }

  send(res, 200)
}))
