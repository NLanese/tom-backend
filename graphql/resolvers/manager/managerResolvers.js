import GraphQLJSON from "graphql-type-json";

// MANAGER MUTATIONS
import managerSignUp from "./mutations/managerSignUp.js";
import refreshManager from "./mutations/refreshManager.js";

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
        ...refreshManager.Mutation
    },
    JSON: GraphQLJSON
}