import GraphQLJSON from 'graphql-type-json';
import adminResolvers from './admin.js'
import usersResolvers from './users.js';
import accidentsResolvers from './accidents.js';
import thirdPartyResolvers from './collision.js';
import injuryAccidentResolvers from './injuryAccident.js';
import propertyAccidentResolvers from './propertyAccident.js';
import hitPersonResolvers from './hitPerson.js';
import injuryReportResolvers from './injuryReport.js';
import superUserResolvers from './superUser.js';

export default {
    Query: {
        ...adminResolvers.Query,
        ...usersResolvers.Query,
        ...accidentsResolvers.Query,
        ...superUserResolvers.Query
    },
    Mutation: {
        ...adminResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...accidentsResolvers.Mutation,
        ...thirdPartyResolvers.Mutation,
        ...injuryAccidentResolvers.Mutation,
        ...propertyAccidentResolvers.Mutation,
        ...hitPersonResolvers.Mutation,
        ...injuryReportResolvers.Mutation,
        ...superUserResolvers.Mutation
    },
    JSON: GraphQLJSON,
}