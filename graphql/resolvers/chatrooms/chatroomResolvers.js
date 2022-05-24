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
import dynamicRemoveManagerFromChatroom from "./mutations/dynamic/dynamicRemoveManagerFromChatroom.js";
import dynamicMuteAndUnmute from "./mutations/dynamic/dynamicMuteAndUnmute.js";
import dynamicLeaveChatroom from "./mutations/dynamic/dynamicLeaveChatroom.js";
import dynamicUpdateChatroom from "./mutations/dynamic/dynamicUpdateChatroom.js";
import dynamicReassignOwnership from "./mutations/dynamic/dynamicReassignOwnership.js";

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
        // DYNAMIC MUTATIONS (OWNER / MANAGER)
        ...dynamicCreateDriverManagementChatroom.Mutation,
        ...dynamicCreateChatroom.Mutation,
        ...dynamicMuteAndUnmute.Mutation,

        // DYNAMIC MUTATIONS (OWNER / MANAGER / DRIVER)
        ...dynamicAddDriverToChatroom.Mutation,
        ...dynamicRemoveDriverFromChatroom.Mutation,
        ...dynamicAddManagerToChatroom.Mutation,
        ...dynamicRemoveManagerFromChatroom.Mutation,
        ...dynamicLeaveChatroom.Mutation,
        ...dynamicUpdateChatroom.Mutation,
        ...dynamicReassignOwnership.Mutation,

        // DRIVER MUTATIONS
        ...driverCreateChatroom.Mutation,
    },
    JSON: GraphQLJSON
}