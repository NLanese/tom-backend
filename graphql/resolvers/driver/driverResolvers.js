import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverSignUp from "./mutations/driverSignUp.js";
import driverSignIn from "./mutations/driverSignIn.js";
import driverUpdate from "./mutations/driverUpdate.js";

// DRIVER QUERIES
import getDriver from "./queries/getDriver.js";

export default {
    Query: {
        // DRIVER QUERIES
        ...getDriver.Query
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverSignUp.Mutation,
        ...driverSignIn.Mutation,
        ...driverUpdate.Mutation
    },
    JSON: GraphQLJSON
}