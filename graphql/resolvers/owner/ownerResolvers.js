import GraphQLJSON from 'graphql-type-json';

// OWNER MUTATIONS
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerSignIn from './mutations/ownerSignIn.js';
import ownerUpdate from './mutations/ownerUpdate.js';

// OWNER QUERIES
import getOwner from './queries/getOwner.js';
import ownerGetEmployedDrivers from './queries/ownerGetEmployedDrivers.js';

export default {
    Query: {
        // OWNER QUERIES
        ...getOwner.Query,
        ...ownerGetEmployedDrivers.Query
    },
    Mutation: {
        // OWNER MUTATIONS
        ...ownerSignUp.Mutation,
        ...ownerSignIn.Mutation,
        ...ownerUpdate.Mutation
    },
    JSON: GraphQLJSON,
}