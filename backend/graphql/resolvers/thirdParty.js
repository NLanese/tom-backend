import { UserInputError } from 'apollo-server-errors';
import checkAuth from '../../utils/check-auth.js';
import db from '../../utils/generatePrisma.js';
import { ApolloError } from 'apollo-server';

export default{
    Mutation: {
        createThirdParty: async (_, { accidentId, location }, context) => {
            const user = await checkAuth(context)

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
                console.log(error)
                throw new UserInputError(error)
            }

            
        },

        updateThirdParty: async (_, { thirdPartyId, location }, context) => {
            const user = await checkAuth(context)

            try{
                return await db.thirdParty.update({
                    where: {
                        id: thirdPartyId
                    },
                    data: {
                        location: location
                    }
                })
            } catch(error){
                throw new Error(error)
            }
        }
    }
}