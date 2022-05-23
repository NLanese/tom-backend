import db from "../../../../utils/generatePrisma";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth";

export default {
    Mutation:{
        muteDriverGlobally: async (_, {driverId, token, role}) => {
            /////////////////
            //  Ownership  //
            /////////////////
            let user
            if (role == "OWNER"){
                user = checkOwnerAuth(token)
            }
            if (role == "MANAGER"){
                user = checkManagerAuth(token)
            }
            if (role == "DRIVER"){
                user = checkDriverAuth(context)
            }

            if (!user){
                throw new Error("Invalid User Token")
            }
            ////////////////
            // DB Actions //
            ////////////////

            const muteDriver = async () => {
                return await db.driver.update({
                    where: {
                        id: driverId
                    },
                    data: {
                        globallyMuted: true
                    }
                })
            }
            
            /////////////////
            // The Process //
            /////////////////    
            
            return muteDriver()
        }
    }
}