const graphql = require('express-graphql')
const cors = require('micro-cors')()
const micro = require('micro')
const schema = require('./schema')
const resolverMap = require('./resolver-map')
const { makeExecutableSchema } = require('graphql-tools')

const executeableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolverMap
})

const server = micro(cors(graphql({
  schema: executeableSchema,
  graphiql: true
})))

server.listen(3000, () => console.log('Server running on port 3000'))
