import GraphQLJSON from "graphql-type-json";

// DYNAMIC QUERIES
import dynamicGetChatrooms from "./queries/dynamic/dynamicGetChatrooms.js";
import dynamicGetChatroomById from "./queries/dynamic/dynamicGetChatroomById.js";

// DRIVER QUERIES
import driverGetChatroomById from "./queries/driver/driverGetChatroomById.js";

// DYNAMIC MUTATIONS
import dynamicCreateDriverManagementChatroom from "./mutations/dynamic/dynamicCreateDriverManagementChatroom.js";

export default {
    Query: {
        // DYNAMIC QUERIES
        ...dynamicGetChatrooms.Query,
        ...dynamicGetChatroomById.Query,

        // DRIVER QUERIES
        ...driverGetChatroomById.Query
    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicCreateDriverManagementChatroom.Mutation,
    },
    JSON: GraphQLJSON
}