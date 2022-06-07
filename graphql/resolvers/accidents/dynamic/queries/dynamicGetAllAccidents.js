import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetAllAccidents: async (_, {
            role,
            token,
        }, context) => {
            let user

            
            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') user = await checkOwnerAuth(token)
            if (role === 'MANAGER') user = await checkManagerAuth(token)

            try{
                return await db.accident.findMany({
                    where: {
                        dspId: user.dsp.id
                    },
                    include: {
                        injuryAccidents: true,
                        collisionAccidents: true,
                        propertyAccidents: true,
                        selfInjuryAccidents: true,
                        driver: true
                    }
                })
            } catch (error){
                throw new Error(error)
            }
        }
    }
}