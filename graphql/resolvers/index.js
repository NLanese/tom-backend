import GraphQLJSON from 'graphql-type-json';
import adminResolvers from './admin.js'
import usersResolvers from './drivers.js';
import accidentsResolvers from './accidents.js';
import thirdPartyResolvers from './collision.js';
import injuryAccidentResolvers from './injuryAccident.js';
import propertyAccidentResolvers from './propertyAccident.js';
import hitPersonResolvers from './hitPerson.js';
import injuryReportResolvers from './injuryReport.js';
import superUserResolvers from './superUser.js';
import messagesResolvers from './messages.js';
import notifiedMessagesResolvers from './notifiedMessages.js';

// NEW RESOLVERS
import ownerReslovers from './owner/ownerResolvers.js';
import managerResolvers from './manager/managerResolvers.js';
import driverResolvers from './driver/driverResolvers.js';
import dspResolvers from './dsp/dspResolvers.js';
import weeklyReportResolvers from './weeklyReport/weeklyReportResolvers.js';

export default {
    Query: {
        ...adminResolvers.Query,
        ...usersResolvers.Query,
        ...accidentsResolvers.Query,
        ...superUserResolvers.Query,
        ...messagesResolvers.Query,
        ...notifiedMessagesResolvers.Query,

        ...ownerReslovers.Query,
        ...managerResolvers.Query,
        ...driverResolvers.Query,
        ...dspResolvers.Query,
        ...weeklyReportResolvers.Query
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
        ...superUserResolvers.Mutation,
        ...messagesResolvers.Mutation,
        ...notifiedMessagesResolvers.Mutation,

        ...ownerReslovers.Mutation,
        ...managerResolvers.Mutation,
        ...driverResolvers.Mutation,
        ...dspResolvers.Mutation,
        ...weeklyReportResolvers.Mutation
    },
    JSON: GraphQLJSON,
}