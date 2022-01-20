import GraphQLJSON from "graphql-type-json";

// OWNERS MUTATIONS
import ownerCreateWeeklyReport from "./mutations/owner/ownerCreateWeeklyReport.js";

// MANAGER MUTATIONS
import managerCreateWeeklyReport from "./mutations/manager/managerCreateWeeklyReport.js";

export default {
    Query: {

    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerCreateWeeklyReport.Mutation,

        // MANAGER MUTATIONS
        ...managerCreateWeeklyReport.Muitation
    },
    JSON: GraphQLJSON
}