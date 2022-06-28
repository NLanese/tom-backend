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
    
            let dateDsp = ""
        
            if (role){
                if (role == "OWNER"){
                    owner = checkOwnerAuth(token)
                    owner = db.owner.findUnique({
                        where: {
                            id: id
                        },
                        include: {
                            dsp: true
                        }
                    })
                    dateDsp = `${date}${owner.dsp.id}`
                }
                if (role == "MANAGER"){
                    manager = checkManagerAuth(token)
                    manager = db.manager.findUnique({
                        where: {
                            id: id
                        },
                        include: {
                            dsp: true
                        }
                    })
                    dateDsp = `${date}${manager.dsp.id}`
                }
                if (role == "DRIVER"){
                    driver = checkDriverAuth(context)
                    driver = db.driver.findUnique({
                        where: {
                            id: id
                        },
                        include: {
                            dsp: true
                        }
                    })
                    dateDsp = `${date}${driver.dsp.id}`
                }
            }


            const foundShift = await db.shift.findUnique({
                where: {
                    dateDsp: dateDsp
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