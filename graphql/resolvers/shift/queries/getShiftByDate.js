import db from "../../../../utils/generatePrisma";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth";

export default {
    getShiftByDate: async (_, {
        role, 
        token,
        date
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
        return await db.shift.findUnique({
            where: {
                date: date
            }
        })
    }
}