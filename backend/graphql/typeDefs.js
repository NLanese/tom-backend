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
  # BASIC INFORMATION
    id:                           ID
    createdAt:                    Date
    role:                         String
    firstname:                    String
    lastname:                     String
    email:                        String
    phoneNumber:                  String
    password:                     String
    profile_Pick:                 JSON
    
    # ACCOUNT INFORMATION
    accountStanding:              String
    locked:                       Boolean
    deleted:                      Boolean

    # NOTIFICATION
    notified:                     Boolean

    # RESET AND SIGNUP TOKEN
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int

    # RELATIONSHIPS
    ownerId:                      Int
    owner:                        Owner
    drivers:                      [Drivers]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          DSP
  }

  type Driver {
    # BASIC INFORMATION
    id:                           ID
    createdAt:                    Date
    role:                         String
    firstname:                    String
    lastname:                     String
    email:                        String
    phoneNumber:                  String
    password:                     String
    profile_Pick:                 JSON
    token:                        String
    
    # DATA FROM SCORECARD
    rank:                         JSON
    employeeId:                   String
    tier:                         JSON
    delivered:                    JSON
    keyFocusArea:                 JSON
    fico:                         JSON
    seatbeltOffRate:              JSON
    speedingEventRate:            JSON
    distractionsRate:             JSON
    followingDistanceRate:        JSON
    signalViolationsRate:         JSON
    deliveryCompletionRate:       JSON
    deliveredNotRecieved:         JSON
    photoOnDelivery:              JSON
    callCompliance:               JSON
    scanCompliance:               JSON
    attendedDeliveryAccuracy:     JSON

    # ADDITIONAL INFORMATION
    netradyne:                    JSON
    deliveryssociate:             JSON
    defects:                      JSON
    customerDeliveryFeedback:     JSON
    hasManyAccidents:             JSON
    belongsToTeam:                JSON
    attendance:                   JSON
    productivity:                 JSON

    # NOTIFICATIONS
    notified:                     Boolean

    # ACCOUNT INFORMATION
    accountStanding:              String
    locked:                       Boolean
    deleted:                      Boolean

    # RESET PASSWORD
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int

    # RELATIONSHIPS
    ownerId:                      Int
    owner:                        Owner
    adminId:                      Int
    admin:                        Admin
    accidents:                    [Accidents]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    vehicle:                      Vehicle
    dsp:                          Dsp
  }

  type Dsp {
    # BASIC INFORMATION
    id:                           Int
    createdAt:                    Date
    name:                         String
    shortcode:                    String

    # DSP SETTINGS
    leaderBoardLimit:             JSON
    ficoLimits:                   JSON
    seatbeltLimits:               JSON
    speedingLimits:               JSON
    distractionLimits:            JSON
    followLimits:                 JSON
    signalLimits:                 JSON
    deliveryCompletionRateLimits: JSON
    scanComplianceLimits:         JSON
    callComplianceLimits:         JSON
    deliveryNotRecievedLimits:    JSON
    photoOnDeliveryLimits:        JSON

    # RELATIONSHIPS
    admins:                       [Admin]
    drivers:                      [Driver]
    ownerId:                      Int
    owner:                        Owner
  }

  type Messages {
    id:        ID
    createdAt: Date
    content: String
    from: String
		driver: Driver
    admin:  Admin
  }

  type NotifiedMessages {
    id:         ID
    createdAt:  Date
    read:       Boolean
    content:    String
    from:       String
    type:       String
    driverId:   Int
    adminId:    Int 
    driver:     Driver
    admin:      Admin
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
    getMessageWithAdmin: [Messages]

    # NOTIFIED MESSAGES QUERIES
    getNotifiedMessages: [NotifiedMessages]

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
    adminCreateDriverAccounts(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, adminEmail: String!, rank: Int!, employeeId: String!, tier: String!, delivered: Int!, key_focus_area: String!, fico: String!, seatbelt_and_speeding: String!, distractions_rate: String!, following_distance_rate: String!, signal_violations_rate: String!, delivery_completion_rate: String!, delivered_and_recieved: Int!, photo_on_delivery: String!, call_compliance: String!, scan_compliance: String!, attended_delivery_accuracy: Int!, dnr: Int!, pod_opps: Int!, cc_opps: Int!): Driver
    adminCreateAccident(driverId: Int!, name: String!, using_safety: Boolean!, safety_failed: Boolean!, number_package_carried: Int!, safety_equipment_used: String!): Accident
    adminUpdateEmployeeByID(driverId: Int, employeeId: String, adminEmail: String, adminFirstname: String, adminLastname: String, fico: Int, netradyne: Int, delivery_associate: Int, seatbelt_and_speeding: Int, defects: Int, customer_delivery_feedback: Int, delivered_and_recieved: Int, delivery_completion_rate: String, photo_on_delivery: String, call_compliance: String, scan_compliance: String, has_many_accidents: Int, belongs_to_team: Boolean, attendence: JSON, productivity: JSON, phoneNumber: String, rank: Int, tier: String, delivered: Int, key_focus_area: String, distractions_rate: String, following_distance_rate: String, signal_violations_rate: String, attended_delivery_accuracy: Int, dnr: Int, pod_opps: Int, cc_opps: Int): Driver
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

    # NOTIFIED MESSAGES MUTATIONS
    readNotifiedMessage(notifiedMessageId: Int!): NotifiedMessages
    notifiedToFalse: Driver

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
    fico: String
    netradyne: Int
    delivery_associate: Int
    defects: Int
    seatbelt_and_speeding: String
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
    rank: Int
    employeeId: String
    teir: String
    delivered: Int
    key_focus_area: String
    distractions_rate: String
    following_distance_rate: String
    signal_violations_rate: String
    attended_delivery_accuracy: Int
    dnr: Int
    pod_opps: Int
    cc_opps: Int
	}
`;

export default typeDefs;