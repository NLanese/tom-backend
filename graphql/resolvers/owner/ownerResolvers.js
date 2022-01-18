import GraphQLJSON from 'graphql-type-json';
import ownerSignUp from './mutations/ownerSignUp.js';
import ownerSignIn from './mutations/ownerSignIn.js';

export default {
    Query: {

    },
    Mutation: {
        ...ownerSignUp.Mutation,
        ...ownerSignIn.Mutation
    },
    JSON: GraphQLJSON,
}