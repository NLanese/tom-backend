import GraphQLJSON from 'graphql-type-json';
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerSignIn from './mutations/ownerSignIn.js';
import getOwner from './queries/getOwner.js';
import updateOwner from './mutations/updateOwner.js';

export default {
    Query: {
        ...getOwner.Query
    },
    Mutation: {
        ...ownerSignUp.Mutation,
        ...ownerSignIn.Mutation,
        ...updateOwner.Mutation
    },
    JSON: GraphQLJSON,
}