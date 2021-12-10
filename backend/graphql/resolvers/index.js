import GraphQLJSON from 'graphql-type-json';
import usersResolvers from './users.js';
import accidentsResolvers from './accidents.js';

export default {
    Query: {
        ...usersResolvers.Query,
        ...accidentsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...accidentsResolvers.Mutation
    },
    JSON: GraphQLJSON,
}