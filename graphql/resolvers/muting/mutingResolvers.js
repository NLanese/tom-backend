import GraphQLJSON from 'graphql-type-json';

// MUTING MUTATIONS
import muteDriverGlobally from "./mutations/muteDriverGlobally.js"

import muteDriverInConversation from './mutations/muteDriverInConversation.js';
import unmuteDriverInConversation from './mutations/unmuteDriverInConversation.js';

import personallyMuteDriver from './mutations/personallyMuteDriver.js';
import personallyUnmuteDriver from './mutations/personallyUnmuteDriver.js';

// MUTING QUERIES
// import findGloballyMutedDrivers from "./queries/findGloballyMutedDrivers.js"
// import findMutedInThisChat from "./queries/findMutedInThisChat.js"

export default {
    Query: {
        // MUTING QUERIES
        // ...findGloballyMutedDrivers.Query,
        // ...findMutedInThisChat.Query,
    },
    Mutation: {
        // MUTING MUTATIONS
        ...muteDriverGlobally.Mutation,
        ...muteDriverInConversation.Mutation,
        ...unmuteDriverInConversation.Mutation,
        // ...personallyMuteDriver.Mutation,
        // ...personallyUnmuteDriver.Mutation,
    },
    JSON: GraphQLJSON,
}