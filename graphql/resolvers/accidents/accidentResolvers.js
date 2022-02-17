import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/driverCreateAccident.js";
import driverCreateCollisionAccident from "./driver/driverCreateCollisionAccident.js";
import driverCreatePropertyAccident from "./driver/driverCreatePropertyAccident.js";

import driverUpdateAccident from "./driver/driverUpdateAccident.js"
import driverUpdateCollisionAccident from "./driver/driverUpdateCollisionAccident.js";
import driverUpdatePropertyAccident from "./driver/driverUpdatePropertyAccident.js";

export default {
    Query: {
    
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverCreateAccident.Mutation,
        ...driverCreateCollisionAccident.Mutation,
        ...driverCreatePropertyAccident.Mutation,

        ...driverUpdateAccident.Mutation,
        ...driverUpdateCollisionAccident.Mutation,
        ...driverUpdatePropertyAccident.Mutation
    },
    JSON: GraphQLJSON
}