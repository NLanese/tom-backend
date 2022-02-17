import GraphQLJSON from "graphql-type-json";

// DRIVER MUTATIONS
import driverCreateAccident from "./driver/driverCreateAccident.js";

export default {
    Query: {
    
    },
    Mutation: {
        // DRIVER MUTATIONS
        ...driverCreateAccident.Mutation
    },
    JSON: GraphQLJSON
}