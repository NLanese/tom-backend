import { gql } from 'apollo-server';

const typeDefs = gql`
	scalar Date
	scalar JSON

  type SuperUser {
    id:                           ID
    createdAt:                    Date
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
    createdAt:                    Date
    role:                         String
    firstname:                    String
    lastname:                     String
    email:                        String
    password:                     String
    phoneNumber:                  String

    dsp_name:                     String
    dsp_shortcode:                String

    token:                        String
    paid:                         Boolean
    accountStatus:                String
    deleted:                      Boolean
    drivers:                      [Driver]
    messages:                     [Messages]
  }

  type Driver {
    id:                           ID
    createdAt:                    Date
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
    seatbelt_and_speeding:        Int
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

    dsp_name:                     String
    dsp_shortcode:                String

    deleted:                      Boolean
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int

    adminId:                      Int
    adminFirstname:               String
    adminLastname:                String
    adminEmail:                   String
    adminPhoneNumber:             String
    adminAccountStanding:         String
    adminApproved:                Boolean

    accidents:                    [Accident]
    admin:                        [Admin]
    vehicle:                      Vehicle
    messages:                     [Messages]
  }

  type Messages {
    id:        ID
    createdAt: Date
    content: String
		driver: Driver
    admin:  Admin
  }

  type Vehicle {
    id:         ID
    driver:     Driver
    vehicle_number: String
    amazon_logo: String
  }

  type Accident {
    id:                     ID
    createdAt:              Date
    driver:                 Driver
    name:                   String
    using_safety:           Boolean
    safety_failed:          Boolean
    number_package_carried: Int
    safety_equipment_used:  String
    police_report_information: JSON
    police_report_photos:      JSON
    vehicle_number:            String
    amazon_logo:               Boolean

    location:               String
    deleted:                Boolean

    hitPerson:              [HitPerson]
    collision:              [Collision]
    injuryAccident:         [InjuryAccident]
    propertyAccident:       [PropertyAccident]
    injuryReport:           [InjuryReport]
  }


  type HitPerson {
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


  type Collision {
    id:                     ID
    accidentId:             Int
    accident:               [Accident]
    location:               String

    deleted:                Boolean
  }


  type InjuryAccident{
    id:                     ID
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
    immediate_attention:    Boolean
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

    injuryAccident:         [InjuryAccident]
    hitPerson:              [HitPerson]
    propertyAccident:       [PropertyAccident]       
  }


    # ---------------------------------------- END SCHEMAS ----------------------------------------

  type Query {
    # SUPER USER QUERIES
    sGetAllAdmins: [Admin]
    sGetAdminById(adminId: Int!): Admin
    sGetUserById(driverId: Int!): Driver
    sGetAccidentById(accidentId: Int!): Accident

    # ADMIN QUERIES
    getAdmin: Admin
    adminGetEmployees: [Driver]
    adminGetFiredEmployees: [Driver]
    adminGetAccidentById(accidentId: Int): Accident
    adminGetUserAccidentsById(driverId: Int): Driver
    # adminGetMessages: [AdminMessages]

    # DRIVER QUERIES
    getDriver: Driver
    getDriverById(driverId: Int): Driver
    getDriversForDspForSafetyAndCompliance: [Driver] 
    getDriversForDspForTeam: [Driver]
    getDriversForScorecardQuality: [Driver]

    # ACCIDENT QUERIES
    getAccidents: [Accident]
    getAccidentById(accidentId: Int!): Accident

    # MESSAGES QUERIES
    getMessages: [Messages]
    adminGetMessagesWithDriver(driverId: Int!): [Messages]
  }

  type Mutation {
    # SUPER USER MUTATIONS
    sSignupSuper(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!): SuperUser!
    sSigninSuper(email: String!, password: String!): SuperUser!
    sSuspendAdmin(adminId: Int!): Admin
    sDeleteAdmin(adminId: Int!): Admin
    sUpdateAdmin(adminId: Int!, email: String, firstname: String, lastname: String, password: String, paid: Boolean, accountStatus: String, deleted: Boolean, phoneNumber: String): Admin

    # ADMIN MUTATIONS
    signupAdmin(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, dsp_name: String!, dsp_shortcode: String!): Admin!
    signinAdmin(email: String!, password: String!): Admin!
    updateAdmin(email: String, firstname: String, lastname: String, password: String, phoneNumber: String, dsp_name: String, dsp_shortcode: String): Admin!
    adminCreateAccident(driverId: Int!, name: String!, using_safety: Boolean!, safety_failed: Boolean!, number_package_carried: Int!, safety_equipment_used: String!): Accident
    adminUpdateEmployeeByID(driverId: Int, employeeId: String, adminEmail: String, adminFirstname: String, adminLastname: String, fico: Int, netradyne: Int, delivery_associate: Int, defects: Int, customer_delivery_feedback: Int, delivered_and_recieved: Int, delivery_completion_rate: Int, photo_on_delivery: Int, call_compliance: Int, scan_compliance: Int, has_many_accidents: Int, belongs_to_team: Boolean, attendence: JSON, productivity: JSON, phoneNumber: String, seatbelt_and_speeding: Int): Driver
    adminUpdateAccident(name: String, accidentId: Int, using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: String): Accident
    adminUpdateCollision(collisionId: Int, accidentId: Int, location: String): Collision
    adminUpdateHitPerson(hitPersonId: Int, medical_attention: Boolean, vehicle_or_pedestrian: String, previous_damage: String, contact_infomation: JSON, injury: String): HitPerson
    adminUpdatePropertyAccident(propertyAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): PropertyAccident
    adminUpdateInjuryReport(injuryReportId: Int, immediate_attention: Boolean, late: JSON, self_injured: Boolean, injury_type: JSON, other_injured: Boolean, before_injury: String, packages: JSON, safety_equipment: JSON, unsafe_conditions: JSON, pain_level: Int, addtional_information: String): InjuryReport
    adminUpdateInjuryAccident(injuryAccidentId: Int, self_injured: Boolean, vehicle_number: String, amazon_logo: Boolean, exact_address: String, action_before_accident: JSON, police_report: JSON, weather: String, wet_ground: Boolean, slippery_ground: Boolean, extra_info: String, rushed_prior: Boolean ): InjuryAccident
    adminSuspendUser(driverId: Int): Driver

    # MESSAGE MUTATIOINS
    sendMessageToAdmin(content: String!): Messages
    adminSendMessageToDriver(driverId: Int!, content: String!): Messages

    # DRIVER MUTATIONS
    signupDriver(signupInput: SignupInput!): Driver!
    signinDriver(email: String!, password: String!): Driver!
    updateDriver(updateDriver: UpdateDriver): Driver!
    deleteDriver(driverId: Int!): Driver!

    # ACCIDENT MUTATIONS
    createAccident(name: String! using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: String, location: String!): Accident
    updateAccident(name: String, accidentId: Int, using_safety: Boolean, safety_failed: Boolean, number_package_carried: Int, safety_equipment_used: String, location: String): Accident
    deleteAccident(accidentId: Int): Accident

    # COLLISION MUTATIONS
    createCollision(accidentId: Int!, location: String!): Collision
    updateCollision(collisionId: Int, location: String): Collision
    deleteCollision(collisionId: Int): Collision

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
    phoneNumber: String!
		firstname: String!
		lastname: String!
		password: String!
    adminEmail: String!
	}

	input UpdateDriver {
		email: String
		firstname: String
		lastname: String
		password: String
    phoneNumber: String
    fico: Int
    netradyne: Int
    delivery_associate: Int
    defects: Int
    seatbelt_and_speeding: Int
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
	}
`;

export default typeDefs;