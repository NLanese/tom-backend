import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateDevice from "./mutations/dynamicCreateOrUpdateDevice.js";
import assignDevice from "./mutations/assignDevice.js";
import getDeviceByType from "./queries/getDeviceByType.js";

export default {
    Query: {
        ...getDeviceByType.Query
    },
    Mutation: {
        ...dynamicCreateOrUpdateDevice.Mutation,
        ...assignDevice.Mutation
    },
    JSON: GraphQLJSON
}