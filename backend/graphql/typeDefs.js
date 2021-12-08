import { gql } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = gql`
	scalar Date
	scalar JSON

    type User {
        id:                     ID
        role:                   String
        firstname:              String
        lastname:               String
        email:                  String
        password:               String
        fico:                   Int
        netradyne:              Int
        da:                     Int
        seatbelt:               Boolean
        speeding:               Boolean
        defects:                Int
        cdf:                    Int
        dar:                    Int
        dcr:                    Int
        pod:                    Int
        cc:                     Int
        sc:                     Int
        has_many_accidents:     Int
        belongs_to_team:        Boolean
        attendence:             JSON
        productivity:           JSON

        accidents:              [Accidents]
    }

`;

export default typeDefs;