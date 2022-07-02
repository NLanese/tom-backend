import GraphQLJSON from "graphql-type-json";
import dynamicSignIn from "./mutations/dynamicSignIn.js";
// import dynamicRefreshUser from "./mutations/dynamicRefreshUser.js";
import sendNativeErrorEmail from "./mutations/sendNativeErrorEmail.js";
import dynamicForgotPassword from "./mutations/dynamicForgotPassword.js";
import dynamicResetPassword from "./mutations/dynamicResetPassword.js";

export default {
    Query: {
    },
    Mutation: {
        ...dynamicSignIn.Mutation,       // Good
        ...sendNativeErrorEmail.Mutation,
        ...dynamicForgotPassword.Mutation,
        ...dynamicResetPassword.Mutation
    },
    JSON: GraphQLJSON
}