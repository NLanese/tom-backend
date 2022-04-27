import GraphQLJSON from "graphql-type-json";

// OWNERS MUTATIONS
import ownerCreateWeeklyReport from "./mutations/owner/ownerCreateWeeklyReport.js";

// MANAGER MUTATIONS
import managerCreateWeeklyReport from "./mutations/manager/managerCreateWeeklyReport.js";

// DRIVER MUTATIONS
import driverAcknowledgeFeedbackMessage from "./mutations/driver/driverAcknowledgeFeedbackMessage.js";

// DYNAMIC MUTATIONS
import dynamicGetWeeklyReportsByDate from "./queries/dynamic/dynamicGetWeeklyReportsByDate.js";
import dynamicSendFeedbackMessage from "./mutations/dynamic/dynamicSendFeedbackMessage.js";

export default {
    Query: {
        ...dynamicGetWeeklyReportsByDate.Query,
    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicSendFeedbackMessage.Mutation,
        
        // OWNER MUTATIONS
        ...ownerCreateWeeklyReport.Mutation,

        // MANAGER MUTATIONS
        ...managerCreateWeeklyReport.Mutation,

        // DRIVER MUTATIONS
        ...driverAcknowledgeFeedbackMessage.Mutation,
    },
    JSON: GraphQLJSON
}