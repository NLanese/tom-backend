import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateShift from "./mutations/dynamicCreateOrUpdateShift.js";
import dynamicManualAssignDrivers from "./mutations/dynamicManualAssignDrivers.js";
import dynamicRemoveDriverFromShift from "./mutations/dynamicRemoveDriverFromShift.js";
import getShiftByDate from "./queries/getShiftByDate.js";

export default {
    Query: {
        ...getShiftByDate.Query
    },
    Mutation: {
        ...dynamicCreateOrUpdateShift.Mutation,
        ...dynamicManualAssignDrivers.Mutation,
        ...dynamicRemoveDriverFromShift.Mutation,

    },
    JSON: GraphQLJSON
}