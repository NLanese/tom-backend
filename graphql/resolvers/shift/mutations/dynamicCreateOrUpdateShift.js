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
                return await db.shift.findUnique({
                    where: {
                        dateDsp: dateDsp
                    }
                })
            }

            findShift(dateDsp).then( resolved => {
                const foundShift = resolved
                return foundShift
            }).then( (foundShift) => {
                // IF TTHERE IS AN EXISTING SHIFT ON THE GIVEN DATE
                if (foundShift !== null){
                    console.log("Exisitng  Shift")
                    try{
                        return db.shift.update({
                            where: {
                                id: foundShift.id
                            },
                            data: {
                                allDriverShifts: allDriverShifts,
                                date: date
                            }
                        })
                        
                    } catch (error){
                        console.log("Error UPDATING the SHIFT")
                        console.log(error)
                        throw new Error(error)
                    }
                }

                 // IF TTHERE IS NOT AN EXISTING SHIFT ON THE GIVEN DATE
                else {
                    console.log("No existing shift")
                    try{
                        return db.shift.create({
                            data: {
                                allDriverShifts: allDriverShifts,
                                dateDsp: dateDsp,
                                date: date,
                                dsp: {
                                    connect: {
                                        id: dspId
                                    }
                                }
                            }
                        })
                        
                    } catch (error){
                        console.log("Error CREATING the SHIFT")
                        console.log(error)
                        throw new Error(error)
                    }
                }

            })
        

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
        
            allDriverShifts.forEach( async (driverShift) => {                 
                for (let i = 0; i < driverShift.amount; i++){         
                    if (driverShift[i].driver.name !== 'No Driver Assigned'){

                        // Finds the driver who has the same Id as the one assigned the current Device
                        findDriver(driverShift[i].driver.id).then( resolved => {
                            return {shifts: resolved.shifts, driverShift: driverShift[i], date: date, index: i}

                        }).then( resolvedObj => {
                            // Creates a new empty array to mimic the existing one. This allows us to make changes to an otherwise read-only
                            let newShifts

                            // If there are no shifts with this date
                            if (!resolvedObj.shifts || resolvedObj.shifts == [] || resolvedObj.shifts == null || resolvedObj.shifts == "undefined"){

                                // Set the new object
                                newShifts = [{
                                    date: resolvedObj.date,
                                    devices: driverShift[index].devices
                                }]

                                console.log("This is the object that will be the entire new  'Shifts'  value for the driver in question, since he did not have any first")
                                console.log(newShifts)
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
                                        devices: driverShift[index].devices,
                                        date: resolvedObj.date
                                    }
                                ]
                            }
                            return {shifts: newShifts, driverShift: driverShift[i], date: resolvedObj.date} 
                        }).then( async (resolved) => {
                            // console.log(resolved)
                            const driver = await db.driver.update({
                                where: {
                                    id: resolved.driverShift.id
                                },
                                data: {
                                    shifts: resolved.shifts
                                }
                            })
                            return {mutationObj: resolved, driver: driver}
                        }).then((Obj) => {
                            console.log(Obj.mutationObj.shifts)
                            console.log(Obj)
                        })                      
                    }
                }
            })


            ///////////////////////////////
            ///    Returns the Shift    ///
            ///////////////////////////////

            return await findShift(dateDsp).then( resolved => {
                console.log(resolved)
                return resolved
            }).then( resolved => {
                return resolved
            })
        }
    }
}