import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
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

            const foundShift = await db.shift.findUnique({
                where: {
                    date: date
                }
            })

            if (!foundShift){
                return ({id: "There is no shift on this date"})
            }
    
            try {
                return await db.shift.findUnique({
                        where: {
                            id: foundShift.id
                        }
                    })
                }
            catch (error){
                throw new Error(error)
            }
            
        }
    }
}