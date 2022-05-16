import GraphQLJSON from "graphql-type-json";

import driverReadAnnouncement from "./mutations/driverReadAnnouncement";

export default {
    Query: {

    }, 
    Mutation: {
        ...driverReadAnnouncement.Mutation
    },
    JSON: GraphQLJSON
}