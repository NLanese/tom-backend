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
        token:                  String
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

        accidents:              [Accident]
    }

    type Accident {
        id:                     ID
        user:                   User
        using_safety:           Boolean
        safety_failed:          Boolean
        number_package_carried: Int
        safety_equipment_used:  JSON
        failed_safety:          Boolean
    }

    # ---------------------------------------- END SCHEMAS ----------------------------------------

    type Query {
		# USER QUERIES
		getUser: User
    }

    type Mutation {
		# USER MUTATIONS
		signupUser(signupInput: SignupInput): User!
		signinUser(email: String!, password: String!): User!
		updateUser(updateUser: UpdateUser): User!
		deleteUser: User!
    }

    #----------------------------------------END QUERIES AND MUTATIONS ----------------------------

    input SignupInput {
		email: String!
		username: String!
		firstname: String
		lastname: String
		password: String!
	}
	input UpdateUser {
		email: String
		username: String
		firstname: String
		lastname: String
		password: String
	}
`;

export default typeDefs;