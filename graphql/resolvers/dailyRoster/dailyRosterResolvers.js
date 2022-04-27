import GraphQLJSON from "graphql-type-json";
import dynamicCreateOrUpdateDailyRoster from "./dynamicCreateOrUpdateDailyRoster.js"

export default {
    Query: {
        
    },
    Mutation: {
        ...dynamicCreateOrUpdateDailyRoster.Mutation
    },
    JSON: GraphQLJSON
}