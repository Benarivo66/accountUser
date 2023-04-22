const { gql } = require('apollo-server'); 
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    isVerified: Boolean!
  }

  type Query {
    getAccountName(bankCode: String!, accountNumber: String!): String!
  }

  type Mutation {
    verifyUser(accountNumber: String!, bankCode: String!, accountName: String!): User!
  }
`;

module.exports = typeDefs;