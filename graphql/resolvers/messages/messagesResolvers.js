import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicSendMessage from "./mutations/dynamic/dynamicSendMessage.js";

// DYNAMIC QUERIES
import dynamicGetChatroomById from "./queries/dynamic/dynamicGetChatroomById.js";

export default {
    Query: {
        // DYNAMIC QUERIES
        ...dynamicGetChatroomById.Query,
    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicSendMessage.Mutation,

    },
    JSON: GraphQLJSON
}