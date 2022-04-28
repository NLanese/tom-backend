import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicUpdateDriver from "./mutations/dynamic/updateDriver.js"

// DRIVER MUTATIONS
import driverSignUp from "./mutations/driverSignUp.js";
import driverSignIn from "./mutations/driverSignIn.js";
import driverUpdate from "./mutations/driverUpdate.js";
import driverResetPassword from "./mutations/driverResetPassword.js";
import driverForgotPassword from "./mutations/driverForgotPassword.js";

// DRIVER QUERIES
import getDriver from "./queries/getDriver.js";
import getDriversFromDsp from "./queries/getDriversFromDsp.js";
import getDriverByResetToken from "./queries/getDriverByResetToken.js";

export default {
    Query: {
        // DRIVER QUERIES
        ...getDriver.Query,
        ...getDriversFromDsp.Query,
        ...getDriverByResetToken.Query
    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicUpdateDriver.Mutation,

        // DRIVER MUTATIONS
        ...driverSignUp.Mutation,
        ...driverSignIn.Mutation,
        ...driverUpdate.Mutation,
        ...driverResetPassword.Mutation,
        ...driverForgotPassword.Mutation
    },
    JSON: GraphQLJSON
}