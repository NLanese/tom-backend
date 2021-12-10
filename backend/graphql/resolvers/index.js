import GraphQLJSON from 'graphql-type-json';
import usersResolvers from './users.js';
import accidentsResolvers from './accidents.js';
import thirdPartyResolvers from './thirdParty.js';
import injuryAccidentResolvers from './injuryAccident.js';

export default {
    Query: {
        ...usersResolvers.Query,
        ...accidentsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...accidentsResolvers.Mutation,
        ...thirdPartyResolvers.Mutation,
        ...injuryAccidentResolvers.Mutation
    },
    JSON: GraphQLJSON,
}