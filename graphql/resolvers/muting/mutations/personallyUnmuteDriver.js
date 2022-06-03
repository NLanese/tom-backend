import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";


export default {
    Mutation: {
        personallyUnmuteDriver: async (_, {muteId, driverId, role, token}, context) => {
            /////////////////
            //  Ownership  //
            /////////////////
            let authorized
            if (role == "OWNER"){
                authorized = checkOwnerAuth(token)
            }
            if (role == "MANAGER"){
                authorized = checkManagerAuth(token)
            }
            if (role == "DRIVER"){
                authorized = checkDriverAuth(context)
            }

            if (!authorized){
                throw new Error("Invalid User Token")
            } 

            let user
            let updatedUser
            switch(role){
                case "MANAGER":
                    user = await db.manager.findUnique({
                        where: {
                            id: driverId
                        }
                    })
                    if (!user)  break
                    updatedUser = await db.owner.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            mutedListIds: user.mutedListIds.filter(id => id !== muteId),
                        }
                    })
                    return updatedUser
                case "OWNER":
                    user = await db.owner.findUnique({
                        where: {
                            id: driverId
                        }
                    })
                    if (!user)  break
                    updatedUser = await db.owner.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            mutedListIds: user.mutedListIds.filter(id => id !== muteId),
                        }
                    })
                    return updatedUser
                    
                   
                }
           
            
            
        }
    }
}