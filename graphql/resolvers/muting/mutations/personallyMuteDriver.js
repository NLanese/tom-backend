import db from "../../../../utils/generatePrisma";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth";

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
                console.log("Invalid token")
                throw new Error("Invalid User Token")
            }
        }
    }
}