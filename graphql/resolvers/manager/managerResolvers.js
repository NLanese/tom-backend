import GraphQLJSON from "graphql-type-json";

// MANAGER MUTATIONS
import managerSignUp from "./mutations/managerSignUp.js";
import managerSignIn from "./mutations/managerSignIn.js"

// MANAGER QUERIES
import getManager from "./queries/getManager.js";
import managerGetEmployedDrivers from "./queries/managerGetEmployedDrivers.js"

export default {
    Query: {
        // MANAGER QUERIES
        ...getManager.Query,
        ...managerGetEmployedDrivers.Query
    },
    Mutation: {
        // MANAGER MUTATION
        ...managerSignUp.Mutation,
        ...managerSignIn.Mutation
    },
    JSON: GraphQLJSON
}