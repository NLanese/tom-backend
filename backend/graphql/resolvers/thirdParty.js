import { UserInputError } from 'apollo-server-errors';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';
import { handleThirdPartyOwnership } from '../../utils/handleOwnership/handleThirdPartyOwnership.js';

export default{
    Mutation: {
        createThirdParty: async (_, { accidentId, location }, context) => {
            const user = await checkUserAuth(context)

            try {
                return await db.thirdParty.create({
                    data: {
                        location: location,
                        accidentId: accidentId,
                        accident: {
                            connect: {
                                id: accidentId
                            }
                        },
                    }
                })
            } catch(error) {
                throw new Error(error)
            }  
        },

        updateThirdParty: async (_, { thirdPartyId, location }, context) => {
            const user = await checkUserAuth(context)
            const verified = handleThirdPartyOwnership(user.id, thirdPartyId)

            try{
                if (verified){
                    return await db.thirdParty.update({
                        where: {
                            id: thirdPartyId
                        },
                        data: {
                            location: location
                        }
                    })
                }
            } catch(error){
                throw new Error(error)
            }
        },

        deleteThirdParty: async (_, { thirdPartyId }, context) => {
            const user = await checkUserAuth(context)
            const verified = handleThirdPartyOwnership(user.id, thirdPartyId)
    
            try {
                if (verified){
                    return await db.thirdParty.delete({
                        where: {
                            id: thirdPartyId
                        }
                    })
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    },
}