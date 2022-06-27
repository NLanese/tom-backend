import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerUpdate from './mutations/ownerUpdate.js';
import refreshOwner from './mutations/refreshOwner.js';
import ownerChangePaymentStatus from './mutations/ownerChangePaymentStatus.js';

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
        ...ownerUpdate.Mutation,
        ...refreshOwner.Mutation,
        ...ownerChangePaymentStatus.Mutation

    },
    JSON: GraphQLJSON,
}