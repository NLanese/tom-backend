import GraphQLJSON from 'graphql-type-json';
import adminResolvers from './admin.js'
import usersResolvers from './users.js';
import accidentsResolvers from './accidents.js';
import thirdPartyResolvers from './thirdParty.js';
import injuryAccidentResolvers from './injuryAccident.js';
import propertyAccidentResolvers from './propertyAccident.js';

export default {
    Query: {
        ...usersResolvers.Query,
        ...accidentsResolvers.Query
    },
    Mutation: {
        ...adminResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...accidentsResolvers.Mutation,
        ...thirdPartyResolvers.Mutation,
        ...injuryAccidentResolvers.Mutation,
        ...propertyAccidentResolvers.Mutation,
    },
    JSON: GraphQLJSON,
}