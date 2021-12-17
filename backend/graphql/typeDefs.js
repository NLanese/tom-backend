import { gql } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = gql`
	scalar Date
	scalar JSON

    type SuperUser {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        token:                        String
        phoneNumber:                  String
    }

    type Admin {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        phoneNumber:                  String
        token:                        String
        paid:                         Boolean
        accountStatus:                String
        deleted:                      Boolean
        users:                        [User]
    }

    type User {
        id:                           ID
        role:                         String
        firstname:                    String
        lastname:                     String
        email:                        String
        password:                     String
        phoneNumber:                  String
        token:                        String
        employeeId:                   String
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

        deleted:                      Boolean
        resetPasswordToken:           String
        resetPasswordTokenExpiration: Int

        adminId:                      Int
        adminFirstname:               String
        adminLastname:                String
        adminUsername:                String
        adminEmail:                   String
        adminAccountStanding:         String
        adminApproved:                Boolean

        accidents:                    [Accident]
        admin:                        [Admin]
        # thirdParty:                   [ThirdParty]
    }

    type Accident {
        id:                     ID
        user:                   User
        name:                   String
        using_safety:           Boolean
        safety_failed:          Boolean
        number_package_carried: Int
        safety_equipment_used:  JSON

        deleted:                      Boolean

        hitPerson:              [HitPerson]
        thirdParty:             [ThirdParty]
        injuryAccident:         [InjuryAccident]
        propertyAccident:       [PropertyAccident]
        injuryReport:           [InjuryReport]
    }


    type HitPerson{
        id:                     ID
        accidentId:             Int
        accident:               [Accident]
        medical_attention:      Boolean
        vehicle_or_pedestrian:  String
        previous_damage:        String
        contact_information:    JSON
        injury:                 String

        deleted:                Boolean

        accident_pictures:      [Image]
    }


    type ThirdParty{
        id:                     ID
        # Not sure if accidentId is needed waiting for testing with deleteAccident Mutation to see
        accidentId:             Int
        accident:               [Accident]
        location:               String

        deleted:                Boolean
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

        deleted:                Boolean
        
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
      action_before_accident:   JSON
      police_report:            JSON
      weather:                  String
      wet_ground:               Boolean
      slippery_ground:          Boolean
      extra_info:               String
      rushed_prior:             Boolean

      deleted:                  Boolean

      accident_pictures:        [Image]

      accidentId:               Int
      accident:                 [Accident]
    }


    type InjuryReport{
      id:                     ID
      immediate_attention:     Boolean
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

      deleted:                Boolean

      accidentId:             Int
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
      # SUPER USER QUERIES
      sGetAllAdmins: [Admin]

      # ADMIN QUERIES
      getAdmin: Admin
      adminGetEmployees: [User]
      adminGetFiredEmployees: [User]
      adminGetAccidentById(accidentId: Int): Accident
      adminGetUserAccidentsById(userId: Int): User

      # USER QUERIES
      getUser: User
      getUserById(userId: Int): User

      # ACCIDENT QUERIES
      getAccidents: [Accident]
      getAccidentById(accidentId: Int!): Accident
    }

    type Mutation {
      # SUPER USER MUTATIONS
      sSignupSuper(email: String!, password: String!, username: String!, firstname: String!, lastname: String!, phoneNumber: String!): SuperUser!
      sSigninSuper(email: String!, password: String!): SuperUser!
      sSuspendAdmin(adminId: Int!): Admin
      sDeleteAdmin(adminId: Int!): Admin
      sUpdateAdmin(adminId: Int!, email: String, username: String, firstname: String, lastname: String, password: String, paid: Boolean, accountStatus: String, deleted: Boolean, phoneNumber: String): Admin

      # ADMIN MUTATIONS
      signupAdmin(email: String!, username: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!): Admin!
      signinAdmin(email: String!, password: String!): Admin!
      updateAdmin(email: String, username: String, firstname: String, lastname: String, password: String, phoneNumber: String): Admin!
      adminCreateAccident(userId: Int!, name: String!, using_safety: Boolean!, safety_failed: Boolean!, number_package_carried: Int!, safety_equipment_used: JSON!): Accident
      adminUpdateEmployeeByID(userId: Int, employeeId: String, adminEmail: String, adminFirstname: String, adminLastname: String, adminUsername: String, fico: Int, netradyne: Int, delivery_associate: Int, seatbelt: Boolean, speeding: Boolean, defects: Int, customer_delivery_feedback: Int, delivered_and_recieved: Int, delivery_completion_rate: Int, photo_on_delivery: Int, call_compliance: Int, scan_compliance: Int, has_many_accidents: Int, belongs_to_team: Boolean, attendence: JSON, productivity: JSON, phoneNumber: String): User
      adminUpdateAccident(name: String, accidentId: Int, using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: JSON): Accident
      adminUpdateThirdParty(thirdPartyId: Int, accidentId: Int, location: String): ThirdParty
      adminUpdateHitPerson(hitPersonId: Int, medical_attention: Boolean, vehicle_or_pedestrian: String, previous_damage: String, contact_infomation: JSON, injury: String): HitPerson
      adminUpdatePropertyAccident(propertyAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): PropertyAccident
      adminUpdateInjuryReport(injuryReportId: Int, immediate_attention: Boolean, late: JSON, self_injured: Boolean, injury_type: JSON, other_injured: Boolean, before_injury: String, packages: JSON, safety_equipment: JSON, unsafe_conditions: JSON, pain_level: Int, addtional_information: String): InjuryReport
      adminUpdateInjuryAccident(injuryAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): InjuryAccident
      adminSuspendUser(userId: Int): User


      # USER MUTATIONS
      signupUser(signupInput: SignupInput!): User!
      signinUser(email: String!, password: String!): User!
      updateUser(updateUser: UpdateUser): User!
      deleteUser(userId: Int!): User!

      # ACCIDENT MUTATIONS
      createAccident(name: String! using_safety: Boolean!, safety_failed: Boolean!, number_package_carried: Int!, safety_equipment_used: JSON!): Accident
      updateAccident(name: String, accidentId: Int, using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: JSON): Accident
      deleteAccident(accidentId: Int): Accident

      # THIRD PARTY MUTATIONS
      createThirdParty(accidentId: Int!, location: String!): ThirdParty
      updateThirdParty(thirdPartyId: Int, location: String): ThirdParty
      deleteThirdParty(thirdPartyId: Int): ThirdParty

      # INJURY ACCIDENT MUTATIONS
      createInjuryAccident(accidentId: Int!, self_injured: Boolean!, vehicle_number: String!, amazon_logo: Boolean!, exact_address: String!, action_before_accident: JSON!, police_report: JSON!, weather: String!, wet_ground: Boolean!, slippery_ground: Boolean!, extra_info: String!, rushed_prior: Boolean!): InjuryAccident
      updateInjuryAccident(injuryAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): InjuryAccident
      deleteInjuryAccident(injuryAccidentId: Int): InjuryAccident

      # PROPERTY ACCIDENT MUTATIONS
      createPropertyAccident(accidentId: Int!, self_injured: Boolean!, vehicle_number: String!, amazon_logo: Boolean!, exact_address: String!, action_before_accident: JSON!, police_report: JSON!, weather: String!, wet_ground: Boolean!, slippery_ground: Boolean!, extra_info: String!, rushed_prior: Boolean!): PropertyAccident
      updatePropertyAccident(propertyAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): PropertyAccident
      deletePropertyAccident(propertyAccidentId: Int): PropertyAccident

      # HIT PERSON MUTATIONS 
      createHitPerson(accidentId: Int!, medical_attention: Boolean!, vehicle_or_pedestrian: String!, previous_damage: String!, contact_infomation: JSON!, injury: String!): HitPerson
      updateHitPerson(hitPersonId: Int, medical_attention: Boolean, vehicle_or_pedestrian: String, previous_damage: String, contact_infomation: JSON, injury: String): HitPerson
      deleteHitPerson(hitPersonId: Int): HitPerson

      # INJURY REPORT MUTATIONS
      createInjuryReport(accidentId: Int!, immediate_attention: Boolean!, late: JSON!, self_injured: Boolean!, injury_type: JSON!, other_injured: Boolean!, before_injury: String!, packages: JSON!, safety_equipment: JSON!, unsafe_conditions: JSON!, pain_level: Int!, additional_information: String!): InjuryReport
      updateInjuryReport(injuryReportId: Int, immediate_attention: Boolean, late: JSON, self_injured: Boolean, injury_type: JSON, other_injured: Boolean, before_injury: String, packages: JSON, safety_equipment: JSON, unsafe_conditions: JSON, pain_level: Int, addtional_information: String): InjuryReport
      deleteInjuryReport(injuryReportId: Int): InjuryReport
    }

    #----------------------------------------END QUERIES AND MUTATIONS ----------------------------

    input SignupInput {
		email: String!
		username: String!
    phoneNumber: String!
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
    phoneNumber: String
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