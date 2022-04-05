import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        getAllShifts: async (_, {
            role, 
            token,
        }, context) => {
            let owner = false
            let driver = false
            let manager = false
            if (role){
                if (role == "OWNER"){
                    owner = checkOwnerAuth(token)
                }
                if (role == "MANAGER"){
                    manager = checkManagerAuth(token)
                }
                if (role == "DRIVER"){
                    driver = checkDriverAuth(context)
                }
            }
            return db.shift.findUnique({
                where: {
                    id 
                }
            })
        }
    }
}