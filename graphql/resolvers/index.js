import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import ownerReslovers from './owner/ownerResolvers.js';
import managerResolvers from './manager/managerResolvers.js';
import driverResolvers from './driver/driverResolvers.js';
import dspResolvers from './dsp/dspResolvers.js';
import weeklyReportResolvers from './weeklyReport/weeklyReportResolvers.js';
import scorecardResolvers from './scorecardTool/scorecardResolvers.js';
import chatroomResolvers from './chatrooms/chatroomResolvers.js';
import messagesResolvers from './messages/messagesResolvers.js';
import accidentResolvers from './accidents/accidentResolvers.js';
import shiftResolvers from './shift/shiftReolvers.js';
import dailyRosterResolvers from './dailyRoster/dailyRosterResolvers.js';

// ADDITIONAL RESOLVERS
import additionalResolvers from './additional/additionalResolvers.js';

export default {
    Query: {
        ...ownerReslovers.Query,
        ...managerResolvers.Query,
        ...driverResolvers.Query,
        ...dspResolvers.Query,
        ...weeklyReportResolvers.Query,
        ...chatroomResolvers.Query,
        ...messagesResolvers.Query,
        ...accidentResolvers.Query,
        ...shiftResolvers.Query,

        ...additionalResolvers.Query
    },
    Mutation: {
        ...ownerReslovers.Mutation,
        ...managerResolvers.Mutation,
        ...driverResolvers.Mutation,
        ...dspResolvers.Mutation,
        ...weeklyReportResolvers.Mutation,
        ...chatroomResolvers.Mutation,
        ...messagesResolvers.Mutation,
        ...accidentResolvers.Mutation,
        ...shiftResolvers.Mutation,

        ...scorecardResolvers.Mutation,
        ...additionalResolvers.Mutation,

        ...dailyRosterResolvers.Mutation
    },
    JSON: GraphQLJSON,
}