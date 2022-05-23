import db from "../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicRemoveDriverFromShift: async (_, {
            token,
            role,
            date,
            driverId,
            dspId
        }, context) => {

            ///////////////////////////////
            ///        Ownership        ///
            ///////////////////////////////

            let owner = false
            let manager = false

            if (role == "OWNER"){
                owner = checkOwnerAuth(token)
            }
            else if(role == "MANAGER"){
                manager = checkManagerAuth(token)
            }
            else {
                throw new Error("No Access! Nice Try, noob")
            }

            // Determines if Valid 
            if (!manager && !owner){
                throw new Error("No owner or manager with the give crudentials found")
            }

            ///////////////////////////////
            ///     Update or Create    ///
            ///////////////////////////////

            const dateDsp = `${date}${dspId}`

            const findShift = async (dateDsp) => {
                try{
                    return await db.shift.findUnique({
                        where: {
                            dateDsp: dateDsp
                        }
                    })
                } catch (err){
                }
            }

            const updateShift = async (dateDsp, newShifts) => {
                try{ 
                    return await db.shift.update({
                        where: {
                            dateDsp: dateDsp
                        },
                        data: {
                            allDriverShifts: newShifts
                        }
                    })
                } catch(error){
                }
            }

            return findShift(dateDsp).then( resolved => {
                let newShift = {...resolved}
                let newAllDriverShifts = [...newShift.allDriverShifts]
                newAllDriverShifts = newAllDriverShifts.filter( (driverShift) => {
                    if (driverShift.driver.id != driverId){
                        return driverShift
                    }
                })
                return updateShift(dateDsp, newAllDriverShifts)
            })

        }
    }
}