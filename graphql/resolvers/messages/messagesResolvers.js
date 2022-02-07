import GraphQLJSON from "graphql-type-json";

// DYNAMIC MUTATIONS
import dynamicSendMessage from "./mutations/dynamic/dynamicSendMessage.js";

// DRIVER MUTATIONS
import driverSendMessage from "./mutations/driver/driverSendMessage.js";

export default {
    Query: {

    },
    Mutation: {
        // DYNAMIC MUTATIONS
        ...dynamicSendMessage.Mutation,

        // DRIVER MUTATIONS
        ...driverSendMessage.Mutation

    },
    JSON: GraphQLJSON
}