import GraphQLJSON from "graphql-type-json";
import dynamicSignIn from "./mutations/dynamicSignIn.js";
// import dynamicRefreshUser from "./mutations/dynamicRefreshUser.js";
import sendNativeErrorEmail from "./mutations/sendNativeErrorEmail.js";

export default {
    Query: {
    },
    Mutation: {
        ...dynamicSignIn.Mutation,       // Good
        ...sendNativeErrorEmail.Mutation
    },
    JSON: GraphQLJSON
}