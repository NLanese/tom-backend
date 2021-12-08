import { gql } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = gql`
	scalar Date
	scalar JSON

`;

export default typeDefs;