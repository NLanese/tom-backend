import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerUpdate from './mutations/ownerUpdate.js';

// OWNER QUERIES
import getOwner from './queries/getOwner.js';

export default {
    Query: {
        // OWNER QUERIES
        ...getOwner.Query,
    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerSignUp.Mutation,
        ...ownerUpdate.Mutation
    },
    JSON: GraphQLJSON,
}