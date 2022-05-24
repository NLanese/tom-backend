import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetAllAccidents: async (_, {
            role,
            token,
        }, context) => {
            let owner;
            let manager;

            
            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)

            try{
                return await db.accident.findMany({
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