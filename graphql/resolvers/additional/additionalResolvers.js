import GraphQLJSON from "graphql-type-json";
import dynamicSignIn from "./mutations/dynamicSignIn.js";
// import dynamicRefreshUser from "./mutations/dynamicRefreshUser.js";

export default {
    Query: {
    },
    Mutation: {
        ...dynamicSignIn.Mutation,       // Good
        // ...dynamicRefreshUser.Mutation
    },
    JSON: GraphQLJSON
}