import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerCreateDsp from './mutations/owner/ownerCreateDsp.js';
import ownerDeleteDsp from './mutations/owner/ownerDeleteDsp.js';
import ownerUpdateDsp from './mutations/owner/ownerUpdateDsp.js';

// MANAGER MUTATIONS
import managerUpdateDsp from './mutations/managers/managerUpdateDsp.js';

// DYNAMIC QUERIES
import dynamicGetDriversFromDsp from './queries/dynamic/dynamicGetDriversFromDsp.js';
import dynamicGetDsp from './queries/dynamic/dynamicGetDsp.js';

// DRIVER QUERIES
import driverGetDriversFromDsp from './queries/driver/driverGetDriversFromDsp.js';

export default {
    Query: {
        // DYNAMIC QUERIES
        ...dynamicGetDriversFromDsp.Query,
        ...dynamicGetDsp.Query,

        // DRIVERS QUERIES
        ...driverGetDriversFromDsp.Query
    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerCreateDsp.Mutation,
        ...ownerDeleteDsp.Mutation,
        ...ownerUpdateDsp.Mutation,

        //  MNANAGER MUTATIONS
        ...managerUpdateDsp.Mutation
    },
    JSON: GraphQLJSON,
}