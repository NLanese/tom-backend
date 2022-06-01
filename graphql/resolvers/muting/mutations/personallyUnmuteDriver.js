import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Mutation: {
        personallyMuteDriver: (_, {chatId, driverId, role, token}, context) => {
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
        }
    }
}