'use strict'

global.WebSocket = require('ws')
require('es6-promise').polyfill()
require('isomorphic-fetch')

// Require exports file with endpoint and auth info
const awsExports = require('./aws-exports')

// Require AppSync module
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
const AWSAppSyncClient = require('aws-appsync').default

const url = awsExports.aws_appsync_graphqlEndpoint
const region = awsExports.aws_project_region
// const type = AUTH_TYPE.AMAZON_COGNITO_USER_POOLS
const ltype = AUTH_TYPE.API_KEY
const cred = 'da2-rsdgpinp3fcwjbxe2lyfwazofm'

module.exports.handler = async (event) => {
  // const jwtToken = event.token

  // Import gql helper and craft a GraphQL query
  const gql = require('graphql-tag')
  const query = gql(`
    query AllPosts($limit: Int) {
      listPosts(limit: $limit){
        items{
          id
          title
          comments{
            items{
              id
              content
            }
          }
          createdAt
          updatedAt
        }
        nextToken
      }
    }`)

  // Set up Apollo client
  const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
      type: ltype,
      apiKey: cred
    },
    disableOffline: true // Uncomment for AWS Lambda
  })
  console.log(client)

  const clienth = await client.hydrated()
  const input = { limit: 7 }
  try {
    const data = await clienth.query({ query: query, variables: input, fetchPolicy: 'network-only' })
    console.log('data : %j', data)
    return {
      statusCode: 200,
      body: 'asdad'
    }
  } catch (e) {
    console.log(e)
  }
  // const client = client.hydrated().then(function (client) {
  // // Now run a query
  //   // client.query({ query: query })
  //   console.log(client)
  //   const input = { limit: 3 }
  //   client.query({ query: query, variables: input, fetchPolicy: 'network-only' }) // Uncomment for AWS Lambda
  //     .then(function logData (data) {
  //       console.log('results of query: %j', data)
  //     })
  //     .catch(console.error)
  // })
}
