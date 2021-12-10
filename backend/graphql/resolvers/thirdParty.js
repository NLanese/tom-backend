import { isHttpQueryError } from 'apollo-server-core';
import checkAuth from '../../utils/check-auth.js';
import db from '../../utils/generatePrisma.js';

export default{
    Mutation: {
        createThirdParty: async (_, {location}, context) => {
            const user = await checkAuth(context)

            try{
                return db.thirdParty.create({
                    data: {
                        accident: {
                            connect: {
                                id: user.id
                            }
                        },
                        location: location

                    }
                })
            } catch(error){
                throw new Error(error)
            }
        },

        updateThirdParty: async (_, {location}, context) => {
            const user = await checkAuth(context)

            try{
                return db.thirdParty.update({location: location})
            } catch(error){
                throw new Error(error)
            }
        }
    }
}