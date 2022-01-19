import GraphQLJSON from "graphql-type-json";

// OWNERS MUTATIONS
import ownerCreateWeeklyReport from "./mutations/owner/ownerCreateWeeklyReport.js";

export default {
    Query: {

    },
    Mutation: {
        ...ownerCreateWeeklyReport.Mutation
    },
    JSON: GraphQLJSON
}