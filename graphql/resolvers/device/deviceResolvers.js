import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateDevice from "./mutations/dynamicCreateOrUpdateDevice.js";
import assignDevice from "./mutations/assignDevice.js";

export default {
    Mutation: {
        ...dynamicCreateOrUpdateDevice.Mutation,
        ...assignDevice.Mutation
    },
    JSON: GraphQLJSON
}