import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateShift from "./mutations/dynamicCreateOrUpdateShift.js";
import dynamicManualAssignDrivers from "./mutations/dynamicManualAssignDrivers.js";
import dynamicRemoveDriverFromShift from "./mutations/dynamicRemoveDriverFromShift.js";
import getShiftByDateDsp from "./queries/getShiftByDateDsp.js";

export default {
    Query: {
        ...getShiftByDateDsp.Query
    },
    Mutation: {
        ...dynamicCreateOrUpdateShift.Mutation,
        ...dynamicManualAssignDrivers.Mutation,
        ...dynamicRemoveDriverFromShift.Mutation,

    },
    JSON: GraphQLJSON
}