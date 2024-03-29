import db from "../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateShift: async (_, {
            token,
            role,
            date,
            allDriverShifts,
            dspId,
            shiftMessage
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

            // Determines Shift Message or Default
            if (!shiftMessage){
                shiftMessage = "Have a safe and successful day!"
            }


            ///////////////////////////////
            ///     Update or Create    ///
            ///////////////////////////////

            const dateDsp = `${date}${dspId}`

            const findShift = async (dateDsp) => {
                return await db.shift.findUnique({
                    where: {
                        dateDsp: dateDsp
                    }
                })
            }

            try {
                findShift(dateDsp).then( resolved => {
                    const foundShift = resolved
                    return foundShift
                }).then( (foundShift) => {
                    // IF TTHERE IS AN EXISTING SHIFT ON THE GIVEN DATE
                    if (foundShift){
                        try{
                            return db.shift.update({
                                where: {
                                    id: foundShift.id
                                },
                                data: {
                                    allDriverShifts: allDriverShifts,
                                    date: date,
                                    shiftMessage: shiftMessage
                                }
                            })
                            
                        } catch (error){
                            throw new Error(error)
                        }
                    }

                    // IF TTHERE IS NOT AN EXISTING SHIFT ON THE GIVEN DATE
                    else {
                        try{
                            return db.shift.create({
                                data: {
                                    allDriverShifts: allDriverShifts,
                                    dateDsp: dateDsp,
                                    date: date,
                                    shiftMessage: shiftMessage,
                                    dsp: {
                                        connect: {
                                            id: dspId
                                        }
                                    }
                                }
                            })
                            
                        } catch (error){
                            throw new Error(error)
                        }
                    }

                })
            } catch(err){
                throw new Error(err)
            }
        

            ///////////////////////////////
            ///    Update User Shifts   ///
            ///////////////////////////////

            // Query to find individual driver mmodel associated with the shift information
            const findDriver = (driverId) => {
                return db.driver.findUnique({            
                    where: {                                      
                        id: driverId         
                    }                                               
                })
            }

            // The Process
            allDriverShifts.forEach( async (driverShift) => {      

                // Finds the driver who has the same Id as the one assigned the current Device
                findDriver(driverShift.driver.id).then( resolved => {
                    return {shifts: resolved.shifts, driverShift: driverShift, devices: driverShift.devices, date: date}
                }).then( resolvedObj => {

                    // Creates a new empty array to mimic the existing one. This allows us to make changes to an otherwise read-only
                    let newShifts = []

                    // If there are no shifts with this date
                    if (!resolvedObj.shifts || resolvedObj.shifts == [] || resolvedObj.shifts == null || resolvedObj.shifts == "undefined"){

                        // Set the new object
                        newShifts = [{
                            date: resolvedObj.date,
                            devices: device
                        }]
                    }


                    // If there is an existing shift array
                    else {

                        // Gets all the existing Shifts in the new object
                        newShifts = resolvedObj.shifts.filter( shift => {
                            if (shift.date !== resolvedObj.date){
                                return shift
                            }
                        })

                        // Adds the new shift to the old array
                        newShifts = [
                            ...newShifts, {
                                devices: resolvedObj.devices,
                                date: resolvedObj.date
                            }
                        ]
                    }

                    return {shifts: newShifts, driverShift: driverShift, date: resolvedObj.date} 

                }).then( async (resolved) => {

                    console.log(resolved)

                    return await db.driver.update({
                        where: {
                            id: resolved.driverShift.driver.id
                        },
                        data: {
                            shifts: resolved.shifts
                        }
                    })
                }).then( resolved => {
                    console.log(resolved.shifts)
                })                     
            })


            ///////////////////////////////
            ///    Returns the Shift    ///
            ///////////////////////////////

            return await findShift(dateDsp).then( resolved => {
                return resolved
            }).then( resolved => {
                return resolved
            })
        }
    }
}