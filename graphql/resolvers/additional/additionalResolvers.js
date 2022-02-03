import GraphQLJSON from "graphql-type-json";
import dynamicSignIn from "./mutations/dynamicSignIn.js";

export default {
    Query: {
        
    },
    Mutation: {
        ...dynamicSignIn.Mutation
    },
    JSON: GraphQLJSON
}