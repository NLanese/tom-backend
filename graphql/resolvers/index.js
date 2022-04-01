import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import ownerReslovers from './owner/ownerResolvers.js';
import managerResolvers from './manager/managerResolvers.js';
import driverResolvers from './driver/driverResolvers.js';
import dspResolvers from './dsp/dspResolvers.js';
import weeklyReportResolvers from './weeklyReport/weeklyReportResolvers.js';
import scorecardResolvers from './scorecardTool/scorecardResolvers.js';
import chatroomResolvers from './chatrooms/chatroomResolvers.js';
import shiftPlannerResolvers from './shiftPlanner/shiftPlannerResolvers.js';
import messagesResolvers from './messages/messagesResolvers.js';
import accidentResolvers from './accidents/accidentResolvers.js';
import shiftPlannerDatesResolvers from './shiftPlannerDates/shiftPlannerDatesResolvers.js';
import shiftReolvers from './shift/shiftReolvers.js';

// ADDITIONAL RESOLVERS
import additionalResolvers from './additional/additionalResolvers.js';

export default {
    Query: {
        ...ownerReslovers.Query,
        ...managerResolvers.Query,
        ...driverResolvers.Query,
        ...dspResolvers.Query,
        ...weeklyReportResolvers.Query,
        ...shiftPlannerResolvers.Query,
        ...chatroomResolvers.Query,
        ...messagesResolvers.Query,
        ...accidentResolvers.Query,
        ...shiftPlannerDatesResolvers.Query,

        ...scorecardResolvers.Query,
        ...additionalResolvers.Query
    },
    Mutation: {
        ...ownerReslovers.Mutation,
        ...managerResolvers.Mutation,
        ...driverResolvers.Mutation,
        ...dspResolvers.Mutation,
        ...weeklyReportResolvers.Mutation,
        ...shiftPlannerResolvers.Mutation,
        ...chatroomResolvers.Mutation,
        ...messagesResolvers.Mutation,
        ...accidentResolvers.Mutation,
        ...shiftPlannerDatesResolvers.Mutation,
        ...shiftReolvers.Mutation,

        ...scorecardResolvers.Mutation,
        ...additionalResolvers.Mutation
    },
    JSON: GraphQLJSON,
}