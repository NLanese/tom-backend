import { UserInputError } from 'apollo-server-errors';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';
import { handleAccidentOwnership } from '../../utils/handleOwnership/handleAccidentOwnership.js';
import handleAdminThirdPartyOwnership from '../../utils/handleOwnership/handleAdminThirdPartyOwnership.js';
import handleAdminThirdPartyDeleteOwnership from '../../utils/handleOwnership/handleAdminThirdPartyDeleteOwnership.js';


export default{
    Mutation: {
        createThirdParty: async (_, { accidentId, location }, context) => {
            const user = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(user.id, accidentId)

            try {
                if (verified) {
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
                }
            } catch(error) {
                throw new Error(error)
            }  
        },

        updateThirdParty: async (_, { thirdPartyId, location }, context) => {
            const user = await checkUserAuth(context)

            const thirdParty = await db.thirdParty.findUnique({
                where: {
                    id: thirdPartyId
                }
            })

            if (!thirdParty) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleThirdPartyOwnership(user.id, thirdPartyId)

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

        adminUpdateThirdParty: async (_, { thirdPartyId, accidentId, location }, context) => {
            const admin = await checkAdminAuth(context)

            const thirdPartyRecord = await db.thirdParty.findUnique({
                where: {
                    id: thirdPartyId
                }
            })

            if (!thirdPartyRecord) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleAdminThirdPartyOwnership(admin.id, thirdPartyId, accidentId)

            try {
                if (verified) {
                    return await db.thirdParty.update({
                        where: {
                            id: thirdPartyId
                        },
                        data: {
                            location: location
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        deleteThirdParty: async (_, { thirdPartyId }, context) => {
            const admin = await checkAdminAuth(context)

            const thirdParty = await db.thirdParty.findUnique({
                where: {
                    id: thirdPartyId
                }
            })

            if (!thirdParty) {
                throw new Error('Error: Third party record does not exist')
            }

            const verified = await handleAdminThirdPartyDeleteOwnership(admin.id, thirdPartyId)
    
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