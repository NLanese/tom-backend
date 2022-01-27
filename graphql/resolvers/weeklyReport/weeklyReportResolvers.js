import GraphQLJSON from "graphql-type-json";

// OWNERS MUTATIONS
import ownerCreateWeeklyReport from "./mutations/owner/ownerCreateWeeklyReport.js";

// MANAGER MUTATIONS
import managerCreateWeeklyReport from "./mutations/manager/managerCreateWeeklyReport.js";

// DRIVER MUTATIONS
import driverAcknowledgeFeedbackMessage from "./mutations/driver/driverAcknowledgeFeedbackMessage.js";

// DYNAMIC MUTATIONS
import dynamicGetWeeklyReportsByDate from "./queries/dynamic/dynamicGetWeeklyReportsByDate.js";

export default {
    Query: {
        ...dynamicGetWeeklyReportsByDate.Query,
    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerCreateWeeklyReport.Mutation,

        // MANAGER MUTATIONS
        ...managerCreateWeeklyReport.Muitation,

        // DRIVER MUTATIONS
        ...driverAcknowledgeFeedbackMessage.Mutation
    },
    JSON: GraphQLJSON
}