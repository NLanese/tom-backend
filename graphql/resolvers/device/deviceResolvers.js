import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateDevice from "./mutations/dynamicCreateOrUpdateDevice.js";
import assignDevice from "./mutations/assignDevice.js";
import getDeviceByType from "./queries/getDeviceByType.js";
import getAllDevices from "./queries/getAllDevices.js";
import deleteDevice from "./mutations/deleteDevice.js";

export default {
    Query: {
        ...getDeviceByType.Query,
        ...getAllDevices.Query
    },
    Mutation: {
        ...dynamicCreateOrUpdateDevice.Mutation,
        ...assignDevice.Mutation,
        ...deleteDevice.Mutation
    },
    JSON: GraphQLJSON
}