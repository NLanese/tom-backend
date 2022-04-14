import GraphQLJSON from "graphql-type-json";
import scorecardToolCreateDriverAccounts from "./mutations/scorecardToolCreateDriverAccounts.js";
import scorecardToolCreateWeeklyReports from "./mutations/scorecardToolCreateWeeklyReports.js";

export default {
    Query: {
    },
    Mutation: {
        ...scorecardToolCreateDriverAccounts.Mutation,
        // ...scorecardToolCreateWeeklyReports.Mutation
    },
    JSON: GraphQLJSON
}