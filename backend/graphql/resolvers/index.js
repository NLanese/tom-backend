import GraphQLJSON from 'graphql-type-json';
import usersResolvers from './users.js';

export default {
    Query: {
        ...usersResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation
    },
    JSON: GraphQLJSON,
}