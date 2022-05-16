import GraphQLJSON from "graphql-type-json";

import driverReadAnnouncement from "./mutations/driverReadAnnouncement";
import dynamicFindAllAnnouncements from "./queries/dynamicFindAllAnnouncements";
import dynamicfindDriversWhoDidntReadAnnouncementById from "./queries/dynamicfindDriversWhoDidntReadAnnouncementById";

export default {
    Query: {
        ...dynamicFindAllAnnouncements.Query,
        ...dynamicfindDriversWhoDidntReadAnnouncementById.Query
    }, 
    Mutation: {
        ...driverReadAnnouncement.Mutation
    },
    JSON: GraphQLJSON
}