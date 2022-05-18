import { gql } from 'apollo-server';

const typeDefs = gql`
	scalar Date
	scalar JSON
###########################
#       Super User        #
###########################

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

###########################
#          Owner          #
###########################

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

    locked:                       Boolean
    deleted:                      Boolean

    notified:                     Boolean

    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int
    signUpToken:                  String

    drivers:                      [Driver]
    managers:                     [Manager]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    chatrooms:                    [Chatroom]
  }


###########################
#         Manager         #
###########################
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

    muted:                        Boolean
    locked:                       Boolean
    deleted:                      Boolean

    notified:                     Boolean

    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int
    
    owner:                        Owner
    drivers:                      [Driver]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    chatrooms:                    [Chatroom]
  }


###########################
#         Driver          #
###########################
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
    shifts:                       [JSON]

    transporterId:                String
    globallyMuted:                        Boolean
    mutedDrivers:                 [JSON]
    locked:                       Boolean
    deleted:                      Boolean

    notified:                     Boolean

    resetPasswordToken:           String
    resetPasswordTokenExpiration: Int

    owner:                        Owner
    accidents:                    [Accident]
    managers:                     [Manager]
    messages:                     [Messages]
    notifiedMessages:             [NotifiedMessages]
    dsp:                          Dsp
    weeklyReport:                 [WeeklyReport]
    chatrooms:                    [Chatroom]
    devices:                      [Device]
  }


###########################
#           Dsp           #
###########################
  type Dsp {
    id:                           ID
    createdAt:                    Date
    name:                         String
    shortcode:                    String
    timeZone:                     String

    ficoLimits:                   JSON
    seatbeltLimits:               JSON
    speedingLimits:               JSON
    distractionLimits:            JSON
    followLimits:                 JSON
    signalLimits:                 JSON
    deliveryCompletionRateLimits: JSON
    deliveryNotRecievedLimits:    JSON
    photoOnDeliveryLimits:        JSON

    topCardLimits:                Int
    smallCardLimits:              Int

    feedbackNotifications:        JSON
    autoSend:                     JSON

    allDevices:                   [JSON]

    paid:                         Boolean
    accountStanding:              String

    owner:                        Owner
    managers:                     [Manager]
    drivers:                      [Driver]
    shifts:                       [Shift]
    weeklyReports:                [WeeklyReport]
    devices:                       [Device]
  }


###########################
#          Shift          #
###########################
  type Shift {
    id:                           ID
    date:                         String
    allDriverShifts:                   [JSON]
    dspId:                        String
    dsp:                          Dsp
  }


###########################
#      Weekly Report      #
###########################
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
    attendedDeliveryAccuracy:     Int
    dnr:                          Int
    podOpps:                      Int
    ccOpps:                       Int

    netradyne:                    JSON
    deliveryAssociate:            JSON
    defects:                      JSON
    customerDeliveryFeedback:     JSON
    hasManyAccidents:             JSON
    belongsToTeam:                JSON
    attendence:                   JSON
    productivity:                 JSON

    driver:                       Driver
    driverId:                     String
    dsp:                          Dsp
    dspId:                        String
  }


###########################
#       DailyRoster       #
###########################
  type DailyRoster {
    id:           ID 
    date:         String
    dsp:          Dsp
    lineup:       JSON
  }

####################
#      Device      #
####################
type Device{
    id:                  ID
    createdAt:           Date
    number:              String
    name:                String
    type:                String
    deviceIndex:         Int

    driverId:            String
    driver:              Driver
    dspId:               String
    dsp:                 Dsp 
  }


###########################
#        Chatroom         #
###########################
  type Chatroom {
    id:                           ID
		createdAt:                    Date

    chatroomName:                 String
  	guests:                       [JSON]
    chatroomOwner:                JSON
    mutedDrivers:                 [JSON]

    driverJoinOnSignUp:           Boolean
    managerJoinOnSignUp:          Boolean

    owner:                        Owner
    managers:                     [Manager]
    drivers:                      [Driver]
    messages:                     [Messages]
  }


###########################
#        Messages         #
###########################
  type Messages {
    id:        ID
    createdAt: Date

    content: String
    from: JSON
    sentAt: String
    visable: Boolean
    reported: Boolean
    reportedBy: JSON

    chatroom: Chatroom
    owner:  Owner
		driver: Driver
    manager:  Manager
  }

###########################
#  Announcement  Message  #
###########################
type AnnouncementMessage {
    id:        ID
    createdAt: Date

    content: String
    from: JSON
    sentAt: String
    readBy: [JSON]

    chatroom: Chatroom
    owner:  Owner
		dsp: Dsp
    manager:  Manager
  }


###########################
#   Feedback Messages ?   #
###########################
  type NotifiedMessages {
    id:         ID
    createdAt:  Date
    read:       Boolean
    readAt:     String
    content:    String
    from:       String
    type:       String
    driverId:   Int
    adminId:    Int 
    driver:     Driver
    manager:    Manager
  }


###########################
#         Accident        #
###########################
  type Accident {
    id:                     ID
    createdAt:              Date
    name:                   String
    date:                   String
    time:                   String
    location:               String

    accident_report:            JSON
    has_logo:                   String
    police_report:              JSON
    before_accident_report:     JSON
    selfDamage:                 JSON
    weather_and_distractions:   JSON

    deleted:                 Boolean
    filled:                  Boolean

    driver:                   Driver
    collisionAccidents:       [CollisionAccident] 
    injuryAccidents:          [InjuryAccident] 
    propertyAccidents:        [PropertyAccident] 
    selfInjuryAccidents:      [SelfInjuryAccident] 
  }

###########################
#    Collision Accident   #
###########################
  type CollisionAccident {
    id:                         ID
    specific_pictures:          JSON
    contact_info:               JSON
    collision_report:           JSON
    extra_info:                 String

    accident:              Accident
    accidentId:            String
    injuryAccident:        [InjuryAccident]
  }

###########################
#     Injury Accident     #
###########################
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


###########################
#  Self Injury Accident   #
###########################
  type SelfInjuryAccident{
    id:                 ID
    animal_report:      JSON
    injuries:           JSON
    injury_report:      JSON
    extra_info:         String
    specific_pictures:  JSON

    accidentId:         String
    accident:           Accident 
}

###########################
#    Property Accident    #
###########################
  type PropertyAccident{
    id:                       ID
    contact_info:             JSON
    damage_report:            JSON
    defective_equip:          [String]
    safety_equip:             [String]
    specific_pictures:        JSON
    extra_info:               String
    types_of_damage:          JSON
    package_report:           JSON

    accident:                 Accident
    accidentId:               String
  }

  # ---------------------------------------- END SCHEMAS ----------------------------------------

  type Query {
    #### OWNER QUERIES ####
    getOwner(id: String): Owner
    #######################

    #### MANAGER QUERIES ####
    getManager(id: String): Manager
    #########################

    #### DRIVER QUERIES ####
    getDriver: Driver                                     # GOOD
    getDriversFromDsp: [Driver]                           # GOOD
    getDriverByResetToken(token: String): Driver          # GOOD
    ########################

    #### DRIVER ACCIDENT QUERIES ####
    driverGetAccidents: [Accident]
    #################################

    #### DYNAMIC ACCIDENT QUERIES ####
    dynamicGetAccidentByDriverId(role: String!, accidentId: String!, driverId: String!): Accident
    dynamicGetAllAccidents(role: String, token: String): [Accident]
    ##################################

    #### DSP QUERIES ####
    dynamicGetDriversFromDsp(role: String!): [Driver]
    driverGetDriversFromDsp: Dsp
    #####################

    #### DEVICE QUERIES ####
    dynamicGetAllDevices(role: String, token: String): [Device]
    dynamicGetDeviceByType(role: String, token: String, type: String!): [Device]
    #######################

    #### SHIFT QUERIES ####
    getShiftByDate(role: String, token: String, date: String!): Shift
    #######################

    #### CHATROOM QUERIES ####
    dynamicGetChatroomById(role: String!, chatroomId: String!, token: String!): Chatroom
    driverGetChatroomById(chatroomId: String!): Chatroom
    #########################

    #### ANNOUNCEMENT QUERIES ####
    dynamicFindAllAnnouncements(role: String!, token: String!): [AnnouncementMessage]
    dynamicfindDriversWhoDidntReadAnnouncementById(role: String! token: String!, announcementId: String!): [Driver]
    ##############################

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
    ownerUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Owner
    #########################

    #### MANAGER MUTATIONS ####
    managerSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, ownerEmail: String!): Manager
    ###########################

    #### DRIVER MUTATIONS ####                                                                                                                  #
    driverSignUp(email: String!, password: String!, firstname: String!, lastname: String!, phoneNumber: String!, signUpToken: String!): Driver  #
    driverSignIn(email: String!, password: String!): Driver                                                                                     #
    driverUpdate(email: String, password: String, firstname: String, lastname: String, phoneNumber: String): Driver                             #
    driverForgotPassword(email: String): Driver 
    driverResetPassword(password: String!, token: String!): Driver
    ##########################

    #### DRIVER ACCIDENT CREATORS ####
    driverCreateAccident(name: String!, date: String!, time: String!, location: String!): Accident
    driverCreateCollisionAccident(accidentId: String!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String, collision_report: JSON!): CollisionAccident
    driverCreatePropertyAccident(accidentId: String!, contact_info: JSON!, damage_report: JSON!, defective_equip: JSON, safety_equip: JSON, specific_pictures: JSON, extra_info: JSON, package_report: JSON, types_of_damage: JSON!): PropertyAccident
    driverCreateInjuryAccident(accidentId: String!, collisionAccidentId: String, contact_info: JSON!, extra_info: String, injured_areas: JSON!, injury_report: JSON!, pain_level: String, specific_pictures: JSON): InjuryAccident
    driverCreateSelfInjuryAccident(accidentId: String!, animal_report: JSON, extra_info: String, injuries: JSON!, injury_report: JSON!, specific_pictures: JSON): SelfInjuryAccident
    #################################

    #### DRIVER ACCIDENT MUTATORS ####
    driverUpdateAccident(accidentId: String!, name: String, date: String, time: String, location: String, accident_report: JSON, has_logo: String, police_report: JSON, before_accident_report: JSON, selfDamage: JSON, weather_and_distractions: JSON): Accident
    driverUpdateCollisionAccident(collisionAccidentId: String!, specific_pictures: JSON, contact_info: JSON!, extra_info: String): CollisionAccident
    driverUpdatePropertyAccident(propertyAccidentId: String!, address: String, object_hit: String, specific_pictures: JSON, safety_equip: JSON, contact_info: JSON, extra_info: String): PropertyAccident
    driverUpdateInjuryAccident(injuryAccidentId: String!, medical_attention: String, immediate_attention: String, injury: JSON, contact_info: JSON, specific_pictures: JSON, pain_level: Int, extra_info: String): InjuryAccident
    ##################################

    #### DYNAMIC ACCIDENT CREATORS ####
    dynamicCreateAccident(driverId: String!, role: String!, name: String, date: String, time: String, location: String, amazon_logo: Boolean, vehicleId: String, number_packages_carried: Int, police_report_information: JSON, general_pictures: JSON, weather: String, rushed_prior: Boolean, distracted: Boolean, extra_info: String, actions_before_accidents: JSON, unsafe_coditions: JSON): Accident
    dynamicCreateCollisionAccident(role: String!, accidentId: String!, driverId: String!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String!): CollisionAccident
    dynamicCreatePropertyAccident(role: String!, accidentId: String!, driverId: String!, address: String!, object_hit: String!, safety_equipment: JSON!, specific_pictures: JSON!, contact_info: JSON!, extra_info: String!): PropertyAccident
    dynamicCreateInjuryAccident(role: String!, accidentId: String, driverId: String!, collisionAccident: String, propertyAccidentId: String, medical_attention: String!, immediate_attention: String!, injury: JSON!, contact_info: JSON!, specific_pictures: JSON!, pain_level: Int!, extra_info: String!): InjuryAccident
    ####################################

    #### DYNAMIC ACCIDENT UPDATORS ####
    dynamicUpdateAccident(role: String!, accidentId: String!, filed: Boolean, name: String, date: String, time: String, location: String, amazon_logo: Boolean, vehicleId: String, number_packages_carried: Int, police_report_information: JSON, general_pictures: JSON, weather: String, rushed_prior: Boolean, distracted: Boolean, extra_info: String, actions_before_accidents: JSON, unsafe_coditions: JSON): Accident
    dynamicUpdateCollisionAccident(role: String!, collisionAccidentId: String!, driverId: String!, specific_pictures: JSON, contact_info: JSON!, extra_info: String): CollisionAccident
    dynamicUpdatePropertyAccident(role: String!, propertyAccidentId: String!, driverId: String!, address: String, object_hit: String, specific_pictures: JSON, safety_equipment: JSON, contact_info: JSON, extra_info: String): PropertyAccident
    dynamicUpdateInjuryAccident(role: String!, injuryAccidentId: String!, driverId: String!, medical_attention: String, immediate_attention: String, injury: JSON, contact_info: JSON, specific_pictures: JSON, pain_level: Int, extra_info: String): InjuryAccident
    ###################################

    #### DYNAMIC SHIFT MUTATIONS ####
    dynamicRemoveDriverFromShift(token: String, role: String, date: String, driverId: String): Shift 
    dynamicManualAssignDrivers(token: String, role: String, date: String, driverIds: [String], dspId: String): Shift
    dynamicCreateOrUpdateShift(token: String, role: String, date: String, allDriverShifts: [JSON], dspId: String): Shift
    #################################

    #### DSP MUTATIONS ####
    ownerCreateDsp(token: String, name: String!, shortcode: String!, timeZone: String!, ficoLimits: JSON!, seatbeltLimits: JSON!, speedingLimits: JSON!, distractionLimits: JSON!, followLimits: JSON!, signalLimits: JSON!, deliveryCompletionRateLimits: JSON!, deliveryNotRecievedLimits: JSON!, photoOnDeliveryLimits: JSON!, topCardLimits: Int!, smallCardLimits: Int!, feedbackNotifications: JSON!, autoSend: JSON!, allDevices: [JSON]): Dsp
    ownerUpdateDsp(token: String, name: String, shortcode: String, timeZone: String, ficoLimits: JSON, seatbeltLimits: JSON, speedingLimits: JSON, distractionLimits: JSON, followLimits: JSON, signalLimits: JSON, deliveryCompletionRateLimits: JSON, deliveryNotRecievedLimits: JSON, photoOnDeliveryLimits: JSON, topCardLimits: Int, smallCardLimits: Int, feedbackNotifications: JSON, autoSend: JSON, allDevices: [JSON]): Dsp
    ownerDeleteDsp(dspId: String!): Dsp
    #######################

    managerUpdateDsp(token: String!, ficoLimits: JSON, seatbeltLimits: JSON, speedingLimits: JSON, distractionLimits: JSON, followLimits: JSON, signalLimits: JSON, deliveryCompletionRateLimits: JSON, deliveryNotRecievedLimits: JSON, photoOnDeliveryLimits: JSON, topCardLimits: Int, smallCardLimits: Int, feedbackNotifications: JSON, autoSend: JSON, allDriverShifts: JSON): Dsp

    #### CHATROOM MUTATIONS ####
    dynamicCreateChatroom(role: String!, guests: [JSON]!, chatroomName: String!): Chatroom
    dynamicAddDriverToChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicRemoveDriverFromChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicAddManagerToChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicRemoveManagerFromChatroom(role: String!, chatroomId: String!, guestId: String!): Chatroom
    dynamicMuteAndUnmute(role: String!, driverId: String, managerId: String): Driver
    dynamicLeaveChatroom(role: String!, chatroomId: String!): Chatroom
    dynamicUpdateChatroom(role: String!, chatroomId: String!, name: String!): Chatroom
    ############################

    driverCreateChatroom(guests: [JSON]!, chatroomName: String!): Chatroom

    # MESSAGES MUTATIONS
    dynamicSendMessage(role: String!, chatroomId: String!, content: String!, token: String!): Chatroom
    dynamicReportMessage(role: String!, messageId: Int!): Messages
    dynamicRemoveMessage(role: String!, messageId: Int!): Messages

    driverSendMessage(chatroomId: String!, content: String!): Messages

    # WEEKLY REPORT MUTATIONS
    driverAcknowledgeFeedbackMessage(reportId: String!): [WeeklyReport]
    ownerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    managerCreateWeeklyReport(driverId: String!, date: String!, feedbackMessage: String!, feedbackStatus: String!, acknowledgedAt: String!, rank: Int!, tier: String!, delivered: Int!, keyFocusArea: String!, fico: String!, seatbeltOffRate: String!, speedingEventRate: String!, distractionsRate: String!, followingDistanceRate: String!, signalViolationsRate: String!, deliveryCompletionRate: String!, deliveredAndRecieved: String!, photoOnDelivery: String!, attendedDeliveryAccuracy: Int!, dnr: Int!, podOpps: Int!, ccOpps: Int!): WeeklyReport

    #### SCORECARD TOOL MUTATIONS ####
    scorecardToolCreateDriverAccounts(token: String, email: String, firstname: String, lastname: String, phoneNumber: String, password: String, transporterId: String, role: String, dspId: String): Driver
    scorecardToolCreateWeeklyReports(token: String, dspId: String, role: String, transporterId: String, date: String, feedbackStatus: String, rank: Int, tier: String, delivered: Int, keyFocusArea: String, fico: String, seatbeltOffRate: String, speedingEventRate: String, distractionsRate: String, followingDistanceRate: String, signalViolationsRate: String, deliveryCompletionRate: String, deliveredAndRecieved: String, photoOnDelivery: String, attendedDeliveryAccuracy: Int, dnr: Int, customerDeliveryFeedback: String, podOpps: Int, ccOpps: Int, feedbackMessage: String, feedbackMessageSent: Boolean): WeeklyReport
    ##################################

    # DYNAMIC MUTATIONS
    dynamicSignIn(email: String!, password: String!): Owner
    dynamicSendFeedbackMessage(role: String!, reportId: String!, message: String!): WeeklyReport
    dynamicUpdateDriver(role: String!, token: String, driverId: String!, email: String, firstname: String, lastname: String, password: String, phoneNumber: String, transporterId: String, dspId: String): Driver

    # DEVICE MUTATIONS
    dynamicCreateOrUpdateDevice(token: String, role: String, name: String, number: String, type: String, deviceIndex: Int, driverId: String, dspId: String, id: Int): Device
    assignDevice(token: String, role: String, name: String, number: String, type: String, driverId: String, dspId: String, id: Int): Device
    deleteDevice(token: String, role: String, id: Int): Device

    # USED FOR TESTING MUTATIONS
    dynamicCreateDriverManagementChatroom(role: String!, driverId: String!, chatroomName: String!): Chatroom
  }
  #----------------------------------------END QUERIES AND MUTATIONS ----------------------------
`;

export default typeDefs;