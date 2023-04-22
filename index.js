require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema/user.js');

const { Query, Mutation } = require('./resolvers/userResolvers');

const server = new ApolloServer({ typeDefs, resolvers: { Query, Mutation } });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});







