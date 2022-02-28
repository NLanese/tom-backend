import GraphQLJSON from "graphql-type-json";
import dynamicSignIn from "./mutations/dynamicSignIn.js";
import dynamicGetManagers from "./mutations/dynamicGetManagers.js";

export default {
    Query: {
        ...dynamicGetManagers.Query
    },
    Mutation: {
        ...dynamicSignIn.Mutation
    },
    JSON: GraphQLJSON
}