import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicCreateDriverManagementChatroom from "./mutations/dynamic/dynamicCreateDriverManagementChatroom.js";

export default {
    Query: {

    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicCreateDriverManagementChatroom.Mutation,
    },
    JSON: GraphQLJSON
}