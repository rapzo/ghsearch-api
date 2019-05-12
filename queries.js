exports.search = `query($query: String!, $first: Int, $cursor: String) {
  search(type: USER, query: $query, first: $first, after: $cursor) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    userCount
    repositoryCount
    edges {
      cursor
      node {
        ... on User {
          login
          name
          company
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories {
            totalCount
          }
          starredRepositories {
            totalCount
          }
          repositoriesContributedTo {
            totalCount
          }
          email
          url
          avatarUrl
          websiteUrl
        }
      }
    }
  }
}`
