import GraphQLJSON from "graphql-type-json";

// OWNERS MUTATIONS

// MANAGER MUTATIONS

// DYNAMIC MUTATIONS
import dynamicCreateShiftPlannerDates from "./mutations/dynamic/createShiftPlannerDates.js";
import dynamicUpdateShiftPlannerDates from "./mutations/dynamic/updateShiftPlannerDates.js";

export default {
    Query: {

    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicCreateShiftPlannerDates.Mutation,
        ...dynamicUpdateShiftPlannerDates.Mutation
    },
    JSON: GraphQLJSON
}