import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicCreateShiftPlannerReport from "./mutations/dynamic/dynamicCreateShiftPlannerReport.js";

// DRIVER QUERIES
import driverGetShiftPlanner from "./queries/driver/driverGetShiftPlanner.js";

export default {
    Query: {
        // DYNAMIC QUERIES

        // DRIVER QUERIES
        ...driverGetShiftPlanner.Query
    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicCreateShiftPlannerReport.Mutation
    },
    JSON: GraphQLJSON
}