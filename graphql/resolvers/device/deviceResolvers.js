import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateDevice from "./mutations/dynamicCreateOrUpdateDevice.js";

export default {
    Mutation: {
        ...dynamicCreateOrUpdateDevice.Mutation
    },
    JSON: GraphQLJSON
}