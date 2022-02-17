import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/driverCreateAccident.js";
import driverCreateCollisionAccident from "./driver/driverCreateCollisionAccident.js";

import driverUpdateAccident from "./driver/driverUpdateAccident.js"
import driverUpdateCollisionAccident from "./driver/driverUpdateCollisionAccident.js";

export default {
    Query: {
    
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverCreateAccident.Mutation,
        ...driverCreateCollisionAccident.Mutation,

        ...driverUpdateAccident.Mutation,
        ...driverUpdateCollisionAccident.Mutation,
    },
    JSON: GraphQLJSON
}