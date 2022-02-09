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
    managers:                       [Manager]
    drivers:                      [Driver]
  }

  type ShiftPlanner {
    id:                           ID
    createdAt:                    Date
    date:                         String

    # SHIFT PLANNER DATA
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

    # DSP QUERIES
    dynamicGetDriversFromDsp(role: String!): [Driver]

    driverGetDriversFromDsp: Dsp

    # CHATROOM QUERIES
    dynamicGetChatroomById(role: String!, chatroomId: String!): Chatroom

    driverGetChatroomById(chatroomId: String!): Chatroom

    # SHIFT PLANNER QUERIES
    driverGetShiftPlaner: [ShiftPlanner]

    # DYNAMIC QUERIES
    dynamicGetWeeklyReportsByDate(role: String!, date: String!): [WeeklyReport]

    # USED FOR TESTING QUERIES    
    dynamicGetChatrooms(role: String!): [Chatroom]

  }
  
  type Mutation {
    # OWNER MUTATIONS
    ownerSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!): Owner
    ownerSignIn(email: String!, password: String!): Owner
    ownerUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Owner

    # MANAGER MUTATIONS
    managerSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, signUpToken: String!): Manager
    managerSignIn(email: String!, password: String!): Manager

    # DRIVER MUTATIONS
    driverSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, signUpToken: String!): Driver
    driverSignIn(email: String!, password: String!): Driver
    driverUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Driver

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

    driverCreateChatroom(guests: [JSON]!, chatroomName: String!): Chatroom

    # MESSAGES MUTATIONS
    dynamicSendMessage(role: String!, chatroomId: String!, content: String!): Messages

    driverSendMessage(chatroomId: String!, content: String!): Messages

    # WEEKLY REPORT MUTATIONS
    driverAcknowledgeFeedbackMessage(reportId: String!): [WeeklyReport]
    ownerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    managerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    # SCORECARD TOOL MUTATIONS
    scorecardToolCreateDriverAccounts(email: String!, firstname: String!, lastname: String!, phoneNumber: String!, password: String!, transporterId: String!, role: String!): Driver
    scorecardToolCreateWeeklyReports(role: String!, transporterId: String!, date: String!, feedbackStatus: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, callCompliance: String!, scanCompliance: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!, feedbackMessage: String, feedbackMessageSent: Boolean): WeeklyReport

    # SHIFT PLANNER TOOL MUTATIONS
    dynamicCreateShiftPlannerFrontEndTool(role: String!, transporterId: String!, date: String!, phoneId: String!, deviceId: String!, vehicleId: String!, cxNumber: String!, message: String!): ShiftPlanner
    
    # SHIFT PLANNER MUTATIONS
    dynamicCreateShiftPlannerReport(role: String!, driverId: String!, date: String!, phoneId: String!, deviceId: String!, vehicleId: String!, cxNumber: String!, message: String!): ShiftPlanner

    # DYNAMIC MUTATIONS
    dynamicSignIn(email: String!, password: String!): Owner
    dynamicSendFeedbackMessage(role: String!, reportId: String!, message: String!): WeeklyReport
    dynamicUpdateDriver(role: String!, driverId: String!, email: String, firstname: String, lastname: String, password: String, phoneNumber: String): Driver

    # USED FOR TESTING MUTATIONS
    dynamicCreateDriverManagementChatroom(role: String!, driverId: String!, chatroomName: String!): Chatroom

  }

  #----------------------------------------END QUERIES AND MUTATIONS ----------------------------
`;

export default typeDefs;