import GraphQLJSON from "graphql-type-json";
import driverSignUp from "./mutations/driverSignUp.js";
import driverSignIn from "./mutations/driverSignIn.js";
import getDriver from "./queries/getDriver.js";

export default {
    Query: {
        ...getDriver.Query
    },
    Mutation: {
        ...driverSignUp.Mutation,
        ...driverSignIn.Mutation
    },
    JSON: GraphQLJSON
}