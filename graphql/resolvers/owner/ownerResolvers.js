import GraphQLJSON from 'graphql-type-json';
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerSignIn from './mutations/ownerSignIn.js';
import getOwner from './queries/getOwner.js';
import ownerUpdate from './mutations/ownerUpdate.js';

export default {
    Query: {
        ...getOwner.Query
    },
    Mutation: {
        ...ownerSignUp.Mutation,
        ...ownerSignIn.Mutation,
        ...ownerUpdate.Mutation
    },
    JSON: GraphQLJSON,
}