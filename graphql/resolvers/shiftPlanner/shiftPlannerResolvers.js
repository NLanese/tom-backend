import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicCreateShiftPlannerFrontEndTool from "./mutations/frontendTool/dynamicCreateShiftPlannerFrontEndTool.js";
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
        ...dynamicCreateShiftPlannerFrontEndTool.Mutation,
        ...dynamicCreateShiftPlannerReport.Mutation
    },
    JSON: GraphQLJSON
}