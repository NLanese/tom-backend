import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateShift from "./mutations/dynamicCreateOrUpdateShift.js";
import getShiftByDate from "./queries/getShiftByDate.js";

export default {
    Query: {
        ...getShiftByDate.Query
    },
    Mutation: {
        ...dynamicCreateOrUpdateShift.Mutation
    },
    JSON: GraphQLJSON
}