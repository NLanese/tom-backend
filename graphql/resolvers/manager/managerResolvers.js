import GraphQLJSON from "graphql-type-json";
import managerSignUp from "./mutations/managerSignUp.js";
import managerSignIn from "./mutations/managerSignIn.js"
import getManager from "./queries/getManager.js";

export default {
    Query: {
        ...getManager.Query
    },
    Mutation: {
        ...managerSignUp.Mutation,
        ...managerSignIn.Mutation
    },
    JSON: GraphQLJSON
}