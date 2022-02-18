import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/mutations/driverCreateAccident.js";
import driverCreateCollisionAccident from "./driver/mutations/driverCreateCollisionAccident.js";
import driverCreatePropertyAccident from "./driver/mutations/driverCreatePropertyAccident.js";
import driverCreateInjuryAccident from "./driver/mutations/driverCreateInjuryAccident.js";

import driverUpdateAccident from "./driver/mutations/driverUpdateAccident.js"
import driverUpdateCollisionAccident from "./driver/mutations/driverUpdateCollisionAccident.js";
import driverUpdatePropertyAccident from "./driver/mutations/driverUpdatePropertyAccident.js";
import driverUpdateInjuryAccident from "./driver/mutations/driverUpdateInjuryAccident.js";

// DRIVER QUERIES
import driverGetAccidents from "./driver/queries/driverGetAccidents.js";

// DYNAMIC MUTATIONS
import dynamicCreateAccident from "./dynamic/mutations/dynamicCreateAccident.js";
import dynamicCreateCollisionAccident from "./dynamic/mutations/dynamicCreateCollisionAccident.js";
import dynamicCreatePropertyAccident from "./dynamic/mutations/dynamicCreatePropertyAccident.js";
import dynamicCreateInjuryAccident from "./dynamic/mutations/dynamicCreateInjuryAccident.js";

import dynamicUpdateAccident from "./dynamic/mutations/dynamicUpdateAccident.js";
import dynamicUpdateCollisionAccident from "./dynamic/mutations/dynamicUpdateCollisionAccident.js";
import dynamicUpdatePropertyAccident from "./dynamic/mutations/dynamicUpdatePropertyAccident.js";
import dynamicUpdateInjuryAccident from "./dynamic/mutations/dynamicUpdateInjuryAccident.js";

// DYNAMIC QUERIES
import dynamicGetAccidentById from "./dynamic/queries/dynamicGetAccidentById.js";
import dynamicGetAccidentsByDriverId from "./dynamic/queries/dynamicGetAccidentsByDriverId.js";

export default {
    Query: {
        // DRIVER QUERIES
        ...driverGetAccidents.Query,

        // DYNAMIC QUERIES
        ...dynamicGetAccidentById.Query,
        ...dynamicGetAccidentsByDriverId.Query
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
        ...dynamicCreatePropertyAccident.Mutation,
        ...dynamicCreateInjuryAccident.Mutation,

        ...dynamicUpdateAccident.Mutation,
        ...dynamicUpdateCollisionAccident.Mutation,
        ...dynamicUpdatePropertyAccident.Mutation,
        ...dynamicUpdateInjuryAccident.Mutation
    },
    JSON: GraphQLJSON
}