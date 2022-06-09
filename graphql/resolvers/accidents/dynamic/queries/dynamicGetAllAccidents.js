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
            let foundUser = false

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER'){
                user = await checkOwnerAuth(token)
                foundUser = await db.owner.findUnique({
                    where: {
                        id: user.id
                    },
                    include: {
                        dsp: true
                    }
                })
            } 
            else if (role === 'MANAGER'){
                 user = await checkManagerAuth(token)
                 foundUser = await db.manager.findUnique({
                    where: {
                        id: user.id
                    },
                    include: {
                        dsp: true
                    }
                })
            }
            else{
                throw new Error("Invalid attempt at accessing accidents! Please make sure you are signed in properly!")
            }
    
            try{
                return await db.accident.findMany({
                    where: {
                        dspId: foundUser.dsp.id
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