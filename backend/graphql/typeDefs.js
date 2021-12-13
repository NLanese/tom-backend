import { gql } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = gql`
	scalar Date
	scalar JSON

    type SuperAdmin {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        token:                        String
    }

    type Admin {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        token:                        String
        users:                        [User]
    }

    type User {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        token:                        String
        fico:                         Int
        netradyne:                    Int
        delivery_associate:           Int
        seatbelt:                     Boolean
        speeding:                     Boolean
        defects:                      Int
        customer_delivery_feedback:   Int
        delivered_and_recieved:       Int
        delivery_completion_rate:     Int
        photo_on_delivery:            Int
        call_compliance:              Int
        scan_compliance:              Int
        has_many_accidents:           Int
        belongs_to_team:              Boolean
        attendence:                   JSON
        productivity:                 JSON

        adminEmail:                   String

        accidents:                    [Accident]
        admin:                        [Admin]
        # thirdParty:                   [ThirdParty]
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
        thirdParty:             [ThirdParty]
        injuryAccident:         [InjuryAccident]
        propertyAccident:       [PropertyAccident]
        injuryReport:           [InjuryReport]
    }


    type HitPerson{
        id:                     ID
        # accidentID:             Int
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
        # Not sure if accidentId is needed waiting for testing with deleteAccident Mutation to see
        accidentId:             Int
        accident:               [Accident]
        location:               String
    }


    type InjuryAccident{
        id:                     ID
        # user:                   User
        self_injured:           Boolean
        vehicle_number:         String
        amazon_logo:            Boolean
        exact_address:          String
        action_before_accident: JSON
        police_report:          JSON
        weather:                String
        wet_ground:             Boolean
        slippery_ground:        Boolean
        extra_info:             String
        rushed_prior:           Boolean
        
        accident_pictures:      [Image]

        # accidentId:             Int
        accident:               [Accident]
    }


    type PropertyAccident{
      id:                       ID
      self_injured:             Boolean
      vehicle_number:           String
      amazon_logo:              Boolean
      exact_address:            String
      action_before_accident:   JSON
      police_report:            JSON
      weather:                  String
      wet_ground:               Boolean
      slippery_ground:          Boolean
      extra_info:               String
      rushed_prior:             Boolean

      accident_pictures:        [Image]

      # accidentId                Int
      accident:                 [Accident]
    }


    type InjuryReport{
      id:                     ID
      immediate_attentio:     Boolean
      late:                   JSON
      self_injured:           Boolean
      injury_type:            JSON
      other_injured:          Boolean
      before_injury:          String
      packages:               JSON
      safety_equipment:       JSON
      unsafe_conditions:      JSON
      pain_level:             Int
      addtional_information:  String

      # accidentID:             Int
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

      # injuryAccidentId:       Int
      injuryAccident:         [InjuryAccident]

      # hitPersonId:            Int
      hitPerson:              [HitPerson]

      # propertyAccidentId:     Int
      propertyAccident:       [PropertyAccident]       
    }


    # ---------------------------------------- END SCHEMAS ----------------------------------------

    type Query {
      # ADMIN QUERIES
      getAdmin: Admin

      # USER QUERIES
      getUser: User
      getUserById(userId: Int): User

      # ACCIDENT QUERIES
      getAccidents: Accident
    }

    type Mutation {
      # ADMIN MUTATIONS
      signupAdmin(email: String!, username: String!, password: String!, firstname: String!, lastname: String!): Admin!
      signinAdmin(email: String!, password: String!): Admin!

      # USER MUTATIONS
      signupUser(signupInput: SignupInput): User!
      signinUser(email: String!, password: String!): User!
      updateUser(updateUser: UpdateUser): User!
      deleteUser: User!

      # ACCIDENT MUTATIONS
      createAccident(using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: JSON, failed_safety: Boolean): Accident
      updateAccident(accidentId: Int, using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: JSON, failed_safety: Boolean): Accident
      deleteAccident(accidentId: Int): Accident

      # THIRD PARTY MUTATIONS
      createThirdParty(accidentId: Int, location: String): ThirdParty
      updateThirdParty(thirdPartyId: Int, location: String): ThirdParty
      deleteThirdParty(thirdPartyId: Int): ThirdParty

      # INJURY ACCIDENT MUTATIONS
      createInjuryAccident(accidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): InjuryAccident
      updateInjuryAccident(injuryAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): InjuryAccident
      deleteInjuryAccident(injuryAccidentId: Int): InjuryAccident

      # PROPERTY ACCIDENT MUTATIONS
      createPropertyAccident(accidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): PropertyAccident
      updatePropertyAccident(propertyAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): PropertyAccident
      deletePropertyAccident(propertyAccidentId: Int): PropertyAccident

    }

    #----------------------------------------END QUERIES AND MUTATIONS ----------------------------

    input SignupInput {
		email: String!
		username: String!
		firstname: String!
		lastname: String!
		password: String!
    adminEmail: String!
	}

	input UpdateUser {
		email: String
		username: String
		firstname: String
		lastname: String
		password: String
    fico: Int
    netradyne: Int
    delivery_associate: Int
    seatbelt: Boolean
    speeding: Boolean
    defects: Int
    customer_delivery_feedback: Int
    delivered_and_recieved: Int
    delivery_completion_rate: Int
    photo_on_delivery: Int
    call_compliance: Int
    scan_compliance: Int
    has_many_accidents: Int
    belongs_to_team: Boolean
    attendance: JSON
    productivity: JSON
    # accidents: Accident[]
	}
`;

export default typeDefs;