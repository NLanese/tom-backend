import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/mutations/creators/driverCreateAccident.js";
import driverCreateCollisionAccident from "./driver/mutations/creators/driverCreateCollisionAccident.js";
import driverCreatePropertyAccident from "./driver/mutations/creators/driverCreatePropertyAccident.js";
import driverCreateInjuryAccident from "./driver/mutations/creators/driverCreateInjuryAccident.js";
import driverCreateSelfInjuryAccident from "./driver/mutations/creators/driverCreateSelfInjuryAccident.js";

import markAccidentComplete from "./dynamic/mutations/updators/markAccidentComplete.js";

import driverUpdateAccident from "./driver/mutations/updators/driverUpdateAccident.js"
import driverUpdateCollisionAccident from "./driver/mutations/updators/driverUpdateCollisionAccident.js";
import driverUpdatePropertyAccident from "./driver/mutations/updators/driverUpdatePropertyAccident.js";
import driverUpdateInjuryAccident from "./driver/mutations/updators/driverUpdateInjuryAccident.js";

// DRIVER QUERIES
import driverGetAccidents from "./driver/queries/driverGetAccidents.js";

// DYNAMIC MUTATIONS
import dynamicCreateAccident from "./dynamic/mutations/creators/dynamicCreateAccident.js";
import dynamicCreateCollisionAccident from "./dynamic/mutations/creators/dynamicCreateCollisionAccident.js";
import dynamicCreatePropertyAccident from "./dynamic/mutations/creators/dynamicCreatePropertyAccident.js";
import dynamicCreateInjuryAccident from "./dynamic/mutations/creators/dynamicCreateInjuryAccident.js";

import dynamicUpdateAccident from "./dynamic/mutations/updators/dynamicUpdateAccident.js";
import dynamicUpdateCollisionAccident from "./dynamic/mutations/updators/dynamicUpdateCollisionAccident.js";
import dynamicUpdatePropertyAccident from "./dynamic/mutations/updators/dynamicUpdatePropertyAccident.js";
import dynamicUpdateInjuryAccident from "./dynamic/mutations/updators/dynamicUpdateInjuryAccident.js";

// DYNAMIC QUERIES
import dynamicGetAccidentById from "./dynamic/queries/dynamicGetAccidentById.js";
import dynamicGetAccidentsByDriverId from "./dynamic/queries/dynamicGetAccidentsByDriverId.js";
import dynamicGetAllAccidents from "./dynamic/queries/dynamicGetAllAccidents.js";

export default {
    Query: {
        // DRIVER QUERIES
        ...driverGetAccidents.Query,

        // DYNAMIC QUERIES
        ...dynamicGetAccidentById.Query,
        ...dynamicGetAccidentsByDriverId.Query,
        ...dynamicGetAllAccidents.Query
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverCreateAccident.Mutation,               // Good
        ...driverCreateCollisionAccident.Mutation,      // Good
        ...driverCreatePropertyAccident.Mutation,       // Good
        ...driverCreateInjuryAccident.Mutation,         // Good
        ...driverCreateSelfInjuryAccident.Mutation,     // Good
        ...markAccidentComplete.Mutation,

        ...driverUpdateAccident.Mutation,               // Good
        ...driverUpdateCollisionAccident.Mutation,      // Good
        ...driverUpdatePropertyAccident.Mutation,       // Good
        ...driverUpdateInjuryAccident.Mutation,         // Good

        // DYNAMIC MUTATIONS
        ...dynamicCreateAccident.Mutation,              // Good
        ...dynamicCreateCollisionAccident.Mutation,     // Good
        ...dynamicCreatePropertyAccident.Mutation,      // Good
        ...dynamicCreateInjuryAccident.Mutation,        // Good

        ...dynamicUpdateAccident.Mutation,              // Good
        ...dynamicUpdateCollisionAccident.Mutation,     // Good
        ...dynamicUpdatePropertyAccident.Mutation,      // Good
        ...dynamicUpdateInjuryAccident.Mutation         // Good
    },
    JSON: GraphQLJSON
}