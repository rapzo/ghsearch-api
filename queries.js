exports.search = (q, perPage) => `
{
  search(query: "${q}", type: USER, first: ${perPage}) {
    userCount
    edges {
      node {
        ... on User {
          login
          name
          company
        }
      }
    }
  }
}
`.trim().replace(
  /(\s{2,}|\n|\t)/g,
  ' '
)