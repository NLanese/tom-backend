import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/driverCreateAccident.js";
import driverCreateCollisionAccident from "./driver/driverCreateCollisionAccident.js";
import driverCreatePropertyAccident from "./driver/driverCreatePropertyAccident.js";
import driverCreateInjuryAccident from "./driver/driverCreateInjuryAccident.js";

import driverUpdateAccident from "./driver/driverUpdateAccident.js"
import driverUpdateCollisionAccident from "./driver/driverUpdateCollisionAccident.js";
import driverUpdatePropertyAccident from "./driver/driverUpdatePropertyAccident.js";
import driverUpdateInjuryAccident from "./driver/driverUpdateInjuryAccident.js";

// DRIVER QUERIES
import driverGetAccidents from "./driver/queries/driverGetAccidents.js";

// DYNAMIC MUTATIONS
import dynamicCreateAccident from "./dynamic/mutations/dynamicCreateAccident.js";
import dynamicCreateCollisionAccident from "./dynamic/mutations/dynamicCreateCollisionAccident.js";
import dynamicCreatePropertyAccident from "./dynamic/mutations/dynamicCreatePropertyAccident.js";

// DYNAMIC QUERIES

export default {
    Query: {
        // DRIVER QUERIES
        ...driverGetAccidents.Query
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverCreateAccident.Mutation,
        ...driverCreateCollisionAccident.Mutation,
        ...driverCreatePropertyAccident.Mutation,
        ...driverCreateInjuryAccident.Mutation,

        ...driverUpdateAccident.Mutation,
        ...driverUpdateCollisionAccident.Mutation,
        ...driverUpdatePropertyAccident.Mutation,
        ...driverUpdateInjuryAccident.Mutation,

        // DYNAMIC MUTATIONS
        ...dynamicCreateAccident.Mutation,
        ...dynamicCreateCollisionAccident.Mutation,
        ...dynamicCreatePropertyAccident.Mutation
    },
    JSON: GraphQLJSON
}