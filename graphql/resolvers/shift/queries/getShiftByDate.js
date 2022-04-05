import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    getShiftByDate: async (_, {
        role, 
        token,
        date
    }, context) => {
        let owner = false
        let driver = false
        let manager = false


        console.log("Hit1")

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

        console.log("Hit2")

        const foundShift = db.shift.findUnique({
            where: {
                data: date
            }
        })


        if (foundShift != null){
            console.log({
                id: foundShift.id,
                date: foundShift.date,
                allDevices: foundShift.allDevices
            })
            return {
                id: foundShift.id,
                date: foundShift.date,
                allDevices: foundShift.allDevices
            }
            // return foundShift
        }
        else{
            throw new Error("no shift of that date found!")
        }
    }
}