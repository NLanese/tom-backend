import { gql } from 'apollo-server';

const typeDefs = gql`
	scalar Date
	scalar JSON

  type SuperUser {
    id:                           ID
    createdAt:                    Date
    role:                         String
    token:                        String
    firstname:                    String
    lastname:                     String
    email:                        String
    password:                     String
    phoneNumber:                  String
    profilePick:                  JSON
  }

  type Owner {
    id:                           ID
    createdAt:                    Date
    role:                         String
    token:                        String
    firstname:                    String
    lastname:                     String
    email:                        String
    password:                     String
    phoneNumber:                  String
    profilePick:                  JSON

    # ACCOUNT INFORMATION
    locked:                       Boolean
    deleted:                      Boolean

    # NOTIFACTION SYSTEM
    notified:                     Boolean

    # RESET PASSWORD
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int
    signUpToken:                  String

    # RELATIONSHIPS
    drivers:                      [Driver]
    managers:                     [Manager]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    chatrooms:                    [Chatroom]
  }

  type Manager {
    id:                           ID
    createdAt:                    Date
    role:                         String
    token:                        String
    firstname:                    String
    lastname:                     String
    email:                        String
    password:                     String
    phoneNumber:                  String
    profilePick:                  JSON

    # ACCOUNT INFORMATION
    muted:                        Boolean
    locked:                       Boolean
    deleted:                      Boolean

    # NOTIFACTION SYSTEM
    notified:                     Boolean

    # RESET PASSWORD
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int
    
    # RELATIONSHIPS
    owner:                        Owner
    drivers:                      [Driver]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    chatrooms:                    [Chatroom]
  }

  type Driver {
    id:                           ID
    createdAt:                    Date
    role:                         String
    token:                        String
    firstname:                    String
    lastname:                     String
    email:                        String
    password:                     String
    phoneNumber:                  String
    profilePick:                  String

    # ACCOUNT INFORMATION
    transporterId:                String
    muted:                        Boolean
    locked:                       Boolean
    deleted:                      Boolean

    # NOTIFACTION SYSTEM
    notified:                     Boolean

    # RESET PASSWORD
    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int

    # RELATIONSHIPS
    owner:                        Owner
    accidents:                    [Accident]
    managers:                       [Manager]
    vehicle:                      Vehicle
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    weeklyReport:                 [WeeklyReport]
    chatrooms:                    [Chatroom]
    shiftPlanners:                [ShiftPlanner]
  }

  type Dsp {
    id:                           ID
    createdAt:                    Date
    name:                         String
    shortcode:                    String
    timeZone:                     String

    # DSP SETTINGS
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
    topCardLimits:                Int
    smallCardLimits:              Int
    feedbackNotifications:        JSON
    autoSend:                     JSON

    # DSP INFORMATION
    paid:                         Boolean
    accountStanding:              String

    # RELATIONSHIPS
    owner:                        Owner
    managers:                     [Manager]
    drivers:                      [Driver]
    shiftPlannerDates:           ShiftPlannerDates
  }

  type ShiftPlannerDates {
    id:                           ID
    createdAt:                    Date
    dates:                        [String]

    # RELATIONSHIPS
    dsp:                          Dsp
  }

  type ShiftPlanner {
    id:                           ID
    createdAt:                    Date

    # SHIFT PLANNER REQUIRED DATA
    sundayDate:      String
    sundayHours:     String
    mondayDate:      String
    mondayHours:     String
    tuesdayDate:     String
    tuesdayHours:    String
    wednesdayDate:   String
    wednesdayHours:  String
    thursdayDate:    String
    thursdayHours:   String
    fridayDate:      String
    fridayHours:     String
    saturdayDate:    String
    saturdayHours:   String
    weekStartDate:   String
    weekEndDate:     String

    # SHIFT PLANNER UNREQUIRED DATA
    phoneId:                      String
    deviceId:                     String
    vehicleId:                    String
    cxNumber:                     String
    message:                      String

    # RELATIONSHIPS
    driver:                       Driver
  }

  type WeeklyReport {
    id:                           ID
    createdAt:                    Date
    date:                         String
    hadAccident:                  Boolean
    feedbackMessage:              String
    feedbackMessageSent:          Boolean
    feedbackStatus:               String
    acknowledged:                 Boolean
    acknowledgedAt:               String

    # DATA FROM SCORECARD TOOL
    rank:                         Int
    tier:                         String
    delivered:                    Int
    keyFocusArea:                 String
    fico:                         String
    seatbeltOffRate:              String
    speedingEventRate:            String
    distractionsRate:             String
    followingDistanceRate:        String
    signalViolationsRate:         String
    deliveryCompletionRate:       String
    deliveredAndRecieved:         String
    photoOnDelivery:              String
    callCompliance:               String
    scanCompliance:               String
    attendedDeliveryAccuracy:     Int
    dnr:                          Int
    podOpps:                      Int
    ccOpps:                       Int

    # ADDITIONAL INFORMATION
    netradyne:                    JSON
    deliveryAssociate:            JSON
    defects:                      JSON
    customerDeliveryFeedback:     JSON
    hasManyAccidents:             JSON
    belongsToTeam:                JSON
    attendence:                   JSON
    productivity:                 JSON

    # RELATIONSHIPS
    driver:                       Driver
  }

  type WeeklySchedule {
    id:                           ID
    createdAt:                    Date
    weekStartDate:                String
    weekEndDate:                  String
    monday:                       JSON
    tuesday:                      JSON
    wednesday:                    JSON
    thursday:                     JSON
    friday:                       JSON
    saturday:                     JSON
    sunday:                       JSON

    # RELATIONSHIPS
    owner:                        Owner
    manager:                      Manager
    driver:                       Driver
  }

  type Chatroom {
    id:                           ID
		createdAt:                    Date

    # CHATROOM INFORMATION
    chatroomName:                 String
  	guests:                       [JSON]
    chatroomOwner:                JSON

    # KEEPS TRACK OF WHO GET AUTO JOINED TO THE ROOM ON SIGN UP
    driverJoinOnSignUp:           Boolean
    managerJoinOnSignUp:          Boolean

    # RELATIONSHIPS
    owner:                        Owner
    managers:                     [Manager]
    drivers:                      [Driver]
    messages:                     [Messages]
  }

  type Messages {
    id:        ID
    createdAt: Date

    # MESSAGE INFORMATION
    content: String
    from: JSON
    visable: Boolean
    reported: Boolean
    reportedBy: JSON

    # RELATIONSHIPS
    chatroom: Chatroom
    owner:  Owner
		driver: Driver
    manager:  Manager
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
    manager:      Manager
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
    name:                   String
    date:                   String
    time:                   String
    location:               String

    # ACCIDENT DATA
    amazon_logo:            Boolean
    vehicleId:              String
    number_packages_carried: Int
    police_report_information: JSON
    general_pictures:          JSON
    weather:                String
    rushed_prior:           Boolean
    distracted:             Boolean
    extra_info:                String
    actions_before_accidents:  JSON
    unsafe_conditions:         JSON

    deleted:                 Boolean
    filled:                  Boolean

    # RELATIONSHIPS
    driver:                  Driver
    collisionAccidents:      [CollisionAccident]
    injuryAccident:          [InjuryAccident]
    propertyAccident:        [PropertyAccident]
  }


  type CollisionAccident {
    id:                         ID
    specific_pictures:          JSON
    contact_info:               JSON
    collision_report:           JSON
    extra_info:                 String

    accident:              Accident
    accidentId:            Int
    injuryAccident:        [InjuryAccident]
  }

  type InjuryAccident{
    id:                     ID
    contact_info:           JSON
    extra_info:             String
    injured_areas:          JSON
    injury_report:          JSON   
    pain_level:             String
    specific_pictures:      JSON
    
    accident:               Accident
    accidentId:             String
    collisionAccident:      CollisionAccident
    collisionId:            String
  }

  type PropertyAccident{
    id:                       ID
    contact_info:             JSON
    damage_report:            JSON
    defective_equip:          JSON
    safety_equip:             JSON
    specific_pictures:        JSON
    extra_info:               String

    accident:                 Accident
    accidentId:               String
  }

  # ---------------------------------------- END SCHEMAS ----------------------------------------

  type Query {
    # OWNER QUERIES
    getOwner: Owner
    ownerGetEmployedDrivers: [Driver]

    # MANAGER QUERIES
    getManager: Manager
    managerGetEmployedDrivers: [Driver]

    # DRIVER QUERIES
    getDriver: Driver
    getDriversFromDsp: [Driver]
    driverGetManagers: [Manager]

    # DRIVER ACCIDENT QUERIES
    driverGetAccidents: [Accident]

    # DYNAMIC ACCIDENT QUERIES
    dynamicGetAccidentById(role: String!, accidentId: String!, driverId: String!): Accident
    dynamicGetAccidentsByDriverId(role: String!, driverId: String!): [Accident]

    # DSP QUERIES
    dynamicGetDriversFromDsp(role: String!): [Driver]

    driverGetDriversFromDsp: Dsp

    # CHATROOM QUERIES
    dynamicGetChatroomById(role: String!, chatroomId: String!): Chatroom

    driverGetChatroomById(chatroomId: String!): Chatroom

    # SHIFT PLANNER QUERIES
    driverGetShiftPlaner: [ShiftPlanner]

    # SHIFT PLANNER DATES MUTATIONS
    dynamicGetDriversForShiftPlannerByDate(role: String!, date: String!): [ShiftPlanner]

    # DYNAMIC QUERIES
    dynamicGetWeeklyReportsByDate(role: String!, date: String!): [WeeklyReport]
    dynamicGetManagers(role: String!): [Manager]

    # USED FOR TESTING QUERIES    
    dynamicGetChatrooms(role: String!): [Chatroom]
    dynamicGetDsp(role: String!): Dsp 
  }
  
  type Mutation {
    #### OWNER MUTATIONS ####
    ownerSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!): Owner
    ownerSignIn(email: String!, password: String!): Owner
    ownerUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Owner
    #########################

    #### MANAGER MUTATIONS ####
    managerSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, signUpToken: String!): Manager
    managerSignIn(email: String!, password: String!): Manager
    ###########################

    #### DRIVER MUTATIONS ####
    driverSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, signUpToken: String!): Driver
    driverSignIn(email: String!, password: String!): Driver
    driverUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Driver
    driverResetPassword(password: String!, token: String!): Driver
    ##########################

    #### DRIVER ACCIDENT CREATORS ####
    driverCreateAccident(name: String!, date: String!, time: String!, location: String!): Accident
    driverCreateCollisionAccident(accidentId: String!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String, collision_report: JSON!): CollisionAccident
    driverCreatePropertyAccident(accidentId: String!, address: String!, object_hit: String!, specific_pictures: JSON!, safety_equipment: JSON!, contact_info: JSON!, extra_info: String!): PropertyAccident
    driverCreateInjuryAccident(accidentId: String!, collisionAccidentId: String, contact_info: JSON!, extra_info: String, injured_areas: JSON!, injury_report: JSON!, pain_level: String, specific_pictures: JSON): InjuryAccident

    #### DRIVER ACCIDENT MUTATORS ####
    driverUpdateAccident(accidentId: String!, name: String, date: String, time: String, location: String, amazon_logo: Boolean, vehicleId: String, number_packages_carried: Int, police_report_information: JSON, general_pictures: JSON, weather: String, rushed_prior: Boolean, distracted: Boolean, extra_info: String, actions_before_accidents: JSON, unsafe_coditions: JSON): Accident
    driverUpdateCollisionAccident(collisionAccidentId: String!, specific_pictures: JSON, contact_info: JSON!, extra_info: String): CollisionAccident
    driverUpdatePropertyAccident(propertyAccidentId: String!, address: String, object_hit: String, specific_pictures: JSON, safety_equipment: JSON, contact_info: JSON, extra_info: String): PropertyAccident
    driverUpdateInjuryAccident(injuryAccidentId: String!, medical_attention: String, immediate_attention: String, injury: JSON, contact_info: JSON, specific_pictures: JSON, pain_level: Int, extra_info: String): InjuryAccident
    ##################################

    #### DYNAMIC ACCIDENT MUTATIONS ####
    dynamicCreateAccident(driverId: String!, role: String!, name: String, date: String, time: String, location: String, amazon_logo: Boolean, vehicleId: String, number_packages_carried: Int, police_report_information: JSON, general_pictures: JSON, weather: String, rushed_prior: Boolean, distracted: Boolean, extra_info: String, actions_before_accidents: JSON, unsafe_coditions: JSON): Accident
    dynamicCreateCollisionAccident(role: String!, accidentId: String!, driverId: String!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String!): CollisionAccident
    dynamicCreatePropertyAccident(role: String!, accidentId: String!, driverId: String!, address: String!, object_hit: String!, safety_equipment: JSON!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String!): PropertyAccident
    dynamicCreateInjuryAccident(role: String!, accidentId: String, driverId: String!, collisionAccident: String, propertyAccidentId: String, medical_attention: String!, immediate_attention: String!, injury: JSON!, contact_info: JSON!, specific_pictures: JSON!, pain_level: Int!, extra_info: String!): InjuryAccident

    dynamicUpdateAccident(role: String!, accidentId: String!, filed: Boolean, name: String, date: String, time: String, location: String, amazon_logo: Boolean, vehicleId: String, number_packages_carried: Int, police_report_information: JSON, general_pictures: JSON, weather: String, rushed_prior: Boolean, distracted: Boolean, extra_info: String, actions_before_accidents: JSON, unsafe_coditions: JSON): Accident
    dynamicUpdateCollisionAccident(role: String!, collisionAccidentId: String!, driverId: String!, specific_pictures: JSON, contact_info: JSON!, extra_info: String): CollisionAccident
    dynamicUpdatePropertyAccident(role: String!, propertyAccidentId: String!, driverId: String!, address: String, object_hit: String, specific_pictures: JSON, safety_equipment: JSON, contact_info: JSON, extra_info: String): PropertyAccident
    dynamicUpdateInjuryAccident(role: String!, injuryAccidentId: String!, driverId: String!, medical_attention: String, immediate_attention: String, injury: JSON, contact_info: JSON, specific_pictures: JSON, pain_level: Int, extra_info: String): InjuryAccident

    # DSP MUTATIONS
    ownerCreateDsp(name: String!, shortcode: String!, timeZone: String!, ficoLimits: JSON!, seatbeltLimits: JSON!, speedingLimits: JSON!, distractionLimits: JSON!, followLimits: JSON!, signalLimits: JSON!, deliveryCompletionRateLimits: JSON!, scanComplianceLimits: JSON!, callComplianceLimits: JSON!, deliveryNotRecievedLimits: JSON!, photoOnDeliveryLimits: JSON!, topCardLimits: Int!, smallCardLimits: Int!, feedbackNotifications: JSON!, autoSend: JSON!): Dsp
    ownerUpdateDsp(name: String, shortcode: String, timeZone: String, ficoLimits: JSON, seatbeltLimits: JSON, speedingLimits: JSON, distractionLimits: JSON, followLimits: JSON, signalLimits: JSON, deliveryCompletionRateLimits: JSON, scanComplianceLimits: JSON, callComplianceLimits: JSON, deliveryNotRecievedLimits: JSON, photoOnDeliveryLimits: JSON, topCardLimits: Int, smallCardLimits: Int, feedbackNotifications: JSON, autoSend: JSON): Dsp
    ownerDeleteDsp(dspId: String!): Dsp

    managerUpdateDsp(ficoLimits: JSON, seatbeltLimits: JSON, speedingLimits: JSON, distractionLimits: JSON, followLimits: JSON, signalLimits: JSON, deliveryCompletionRateLimits: JSON, scanComplianceLimits: JSON, callComplianceLimits: JSON, deliveryNotRecievedLimits: JSON, photoOnDeliveryLimits: JSON, topCardLimits: Int, smallCardLimits: Int, feedbackNotifications: JSON, autoSend: JSON): Dsp

    # CHATROOM MUTATIONS
    dynamicCreateChatroom(role: String!, guests: [JSON]!, chatroomName: String!): Chatroom
    dynamicAddDriverToChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicRemoveDriverFromChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicAddManagerToChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicRemoveManagerFromChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicMuteAndUnmute(role: String!, driverId: String, managerId: String): Driver
    dynamicLeaveChatroom(role: String!, chatroomId: String!): Chatroom
    dynamicUpdateChatroom(role: String!, chatroomId: String!, name: String!): Chatroom

    driverCreateChatroom(guests: [JSON]!, chatroomName: String!): Chatroom

    # MESSAGES MUTATIONS
    dynamicSendMessage(role: String!, chatroomId: String!, content: String!): Chatroom
    dynamicReportMessage(role: String!, messageId: Int!): Messages
    dynamicRemoveMessage(role: String!, messageId: Int!): Messages

    driverSendMessage(chatroomId: String!, content: String!): Messages

    # WEEKLY REPORT MUTATIONS
    driverAcknowledgeFeedbackMessage(reportId: String!): [WeeklyReport]
    ownerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    managerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    # SCORECARD TOOL MUTATIONS
    scorecardToolCreateDriverAccounts(email: String!, firstname: String!, lastname: String!, phoneNumber: String!, password: String!, transporterId: String!, role: String!): Driver
    scorecardToolCreateWeeklyReports(role: String!, transporterId: String!, date: String!, feedbackStatus: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!, feedbackMessage: String, feedbackMessageSent: Boolean): WeeklyReport

    # SHIFT PLANNER TOOL MUTATIONS
    dynamicCreateShiftPlannerFrontEndTool(role: String!, transporterId: String!, phoneId: String, deviceId: String, vehicleId: String, cxNumber: String, message: String, sundayDate: String!, sundayHours: String!, mondayDate: String!, mondayHours: String!, tuesdayDate: String!, tuesdayHours: String!, wednesdayDate: String!, wednesdayHours: String!, thursdayDate: String!, thursdayHours: String!, fridayDate: String!, fridayHours: String!, saturdayDate: String!, saturdayHours: String!, weekStartDate: String!, weekEndDate: String!): ShiftPlanner
    
    # SHIFT PLANNER MUTATIONS
    dynamicCreateShiftPlannerReport(role: String!, driverId: String!, phoneId: String, deviceId: String, vehicleId: String, cxNumber: String, message: String, sundayDate: String!, sundayHours: String!, mondayDate: String!, mondayHours: String!, tuesdayDate: String!, tuesdayHours: String!, wednesdayDate: String!, wednesdayHours: String!, thursdayDate: String!, thursdayHours: String!, fridayDate: String!, fridayHours: String!, saturdayDate: String!, saturdayHours: String!, weekStartDate: String!, weekEndDate: String!): ShiftPlanner

    # SHIFT PLANNER DATES MUTATIONS
    dynamicUpdateShiftPlannerDates(role: String!, dates: [String!]): ShiftPlannerDates

    # DYNAMIC MUTATIONS
    dynamicSignIn(email: String!, password: String!): Owner
    dynamicSendFeedbackMessage(role: String!, reportId: String!, message: String!): WeeklyReport
    dynamicUpdateDriver(role: String!, driverId: String!, email: String, firstname: String, lastname: String, password: String, phoneNumber: String): Driver

    # USED FOR TESTING MUTATIONS
    dynamicCreateDriverManagementChatroom(role: String!, driverId: String!, chatroomName: String!): Chatroom
    dynamicCreateShiftPlannerDates(role: String!, dates: [String!]): [ShiftPlannerDates]
  }
  #----------------------------------------END QUERIES AND MUTATIONS ----------------------------
`;

export default typeDefs;