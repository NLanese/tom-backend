import GraphQLJSON from "graphql-type-json";

// MANAGER MUTATIONS
import managerSignUp from "./mutations/managerSignUp.js";

// MANAGER QUERIES
import getManager from "./queries/getManager.js";

export default {
    Query: {
        // MANAGER QUERIES
        ...getManager.Query,
    },
    Mutation: {
        // MANAGER MUTATION
        ...managerSignUp.Mutation,
    },
    JSON: GraphQLJSON
}