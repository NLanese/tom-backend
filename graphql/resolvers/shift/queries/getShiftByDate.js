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
    
            const findShift = async (date) => {
                console.log("In mutation function")
                try {
                    const foundShift = await db.shift.findUnique({
                        where: {
                            date: date
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
                return foundShift
            }
    
            const foundShift = findShift(date).then( resolved => {
                console.log(resolved)
                if (resolved.id != 'undefined'){
                    console.log({
                        id: resolved.id,
                        date: resolved.date,
                        allDevices: resolved.allDevices
                    })
                    return foundShift
                }
                else{
                    throw new Error("no shift of that date found!")
                }
            })
    
            console.log(foundShift)

        }
    }
}