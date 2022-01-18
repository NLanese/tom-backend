import GraphQLJSON from 'graphql-type-json';
import ownerSignUp from './mutations/ownerSignUp.js';

export default {
    Query: {

    },
    Mutation: {
        ...ownerSignUp.Mutation
    },
    JSON: GraphQLJSON,
}