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

        hitPerson:              [HitPerson]
        thirdParty:             [thirdParty]
        injuryAccident:         [InjuryAccident]
        propertyAccident:       [PropertyAccident]
        injuryReport:           [InjuryReport]
    }


    type HitPerson{
        id:                     ID
        accidentID:             Int
        accident:               [Accident]
        medical_attention:      Boolean
        vehicle_or_pedestrian:  String
        previous_damage:        String
        contact_information:    JSON
        injury:                 String

        accident_pictures:      [Image]
    }


    type ThirdParty{
        id:                     ID
        accidentId:             Int
        accident:               [Accident]
        location:               String
    }


    type InjuryAccident{
        id:                     ID
        self_injured:           Boolean
        vehicle_number:         String
        amazon_logo:            Boolean
        exact_address:          String
        action_before_accident: Json
        police_report:          Json
        weather:                String
        wet_ground:             Boolean
        slippery_ground:        Boolean
        extra_info:             String
        rushed_prior:           Boolean
        
        accident_pictures:      [Image]

        accidentId:             Int
        accident:               [Accident]
    }


    type PropertyAccident{
      id:                       ID
      self_injured:             Boolean
      vehicle_number:           String
      amazon_logo:              Boolean
      exact_address:            String
      action_before_accident:   Json
      police_report:            Json
      weather:                  String
      wet_ground:               Boolean
      slippery_ground:          Boolean
      extra_info:               String
      rushed_prior:             Boolean

      accident_pictures:        [Image]

      accidentId                Int
      accident                  [Accident]
    }


    type InjuryReport{
      id:                     ID
      immediate_attentio:     Boolean
      late:                   Json
      self_injured:           Boolean
      injury_type:            Json
      other_injured:          Boolean
      before_injury:          String
      packages:               Json
      safety_equipment:       Json
      unsafe_conditions:      Json
      pain_level:             Int
      addtional_information:  String

      accidentID:             Int
      accident:               [Accident]
    }



    type Image{
      id:                     ID
      fieldname:              String
      path:                   String
      mimetype:               String
      size:                   Int
      originalname:           String
      encoding:               String
      destination:            String
      filename:               String

      injuryAccidentId:       Int
      injuryAccident:         [InjuryAccident]

      hitPersonId:            Int
      hitPerson               [HitPerson]

      propertyAccidentId:     Int
      propertyAccident:       [PropertyAccident]       
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