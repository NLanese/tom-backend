import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerCreateDsp from './mutations/owner/ownerCreateDsp.js';
import ownerDeleteDsp from './mutations/owner/ownerDeleteDsp.js';
import ownerUpdateDsp from './mutations/owner/ownerUpdateDsp.js';

// MANAGER MUTATIONS
import managerUpdateDsp from './mutations/managers/managerUpdateDsp.js';

// DYNAMIC QUERIES
import dynamicGetDriversFromDsp from './queries/dynamic/dynamicGetDriversFromDsp.js';

export default {
    Query: {
        ...dynamicGetDriversFromDsp.Query,
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