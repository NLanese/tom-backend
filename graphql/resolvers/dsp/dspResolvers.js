import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerCreateDsp from './mutations/owner/ownerCreateDsp.js';
import ownerDeleteDsp from './mutations/owner/ownerDeleteDsp.js';

export default {
    Query: {
        
    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerCreateDsp.Mutation,
        ...ownerDeleteDsp.Mutation
    },
    JSON: GraphQLJSON,
}