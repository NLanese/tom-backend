import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS (OWNER / MANAGER)
import dynamicSendMessage from "./mutations/dynamic/dynamicSendMessage.js";
import dynamicRemoveMessage from "./mutations/dynamic/dynamicRemoveMessage.js";

// DYNAMIC MUTATIONS (OWNER / MANAGER / DRIVER)
import dynamicReportMessage from "./mutations/dynamic/dynamicReportMessage.js";

// DRIVER MUTATIONS
import driverSendMessage from "./mutations/driver/driverSendMessage.js";

export default {
    Query: {

    },
    Mutation: {
        // DYNAMIC MUTATIONS  (OWNER / MANAGER)
        ...dynamicSendMessage.Mutation,
        ...dynamicRemoveMessage.Mutation,

        // DYNAMIC MUTATIONS  (OWNER / MANAGER)
        ...dynamicReportMessage.Mutation,

        // DRIVER MUTATIONS
        ...driverSendMessage.Mutation

    },
    JSON: GraphQLJSON
}