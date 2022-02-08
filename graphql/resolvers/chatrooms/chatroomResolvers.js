import GraphQLJSON from "graphql-type-json";

// DYNAMIC QUERIES
import dynamicGetChatrooms from "./queries/dynamic/dynamicGetChatrooms.js";
import dynamicGetChatroomById from "./queries/dynamic/dynamicGetChatroomById.js";

// DRIVER QUERIES
import driverGetChatroomById from "./queries/driver/driverGetChatroomById.js";

// DYNAMIC MUTATIONS
import dynamicCreateDriverManagementChatroom from "./mutations/dynamic/dynamicCreateDriverManagementChatroom.js";
import dynamicCreateChatroom from "./mutations/dynamic/dynamicCreateChatroom.js";
import dynamicAddDriverToChatroom from "./mutations/dynamic/dynamicAddDriverToChatroom.js";
import dynamicRemoveDriverFromChatroom from "./mutations/dynamic/dynamicRemoveDriverFromChatroom.js";
import dynamicAddManagerToChatroom from "./mutations/dynamic/dynamicAddManagerToChatroom.js";

// DRIVER MUTATIONS
import driverCreateChatroom from "./mutations/driver/driverCreateChatroom.js";

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
        ...dynamicCreateChatroom.Mutation,
        ...dynamicAddDriverToChatroom.Mutation,
        ...dynamicRemoveDriverFromChatroom.Mutation,
        ...dynamicAddManagerToChatroom.Mutation,

        // DRIVER MUTATIONS
        ...driverCreateChatroom.Mutation,
    },
    JSON: GraphQLJSON
}