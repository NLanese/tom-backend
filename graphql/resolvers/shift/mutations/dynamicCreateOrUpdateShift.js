import db from "../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateShift: async (_, {
            token,
            role,
            date,
            allDevices,
            dspId
        }, context) => {

            ///////////////////////////////
            ///        Ownership        ///
            ///////////////////////////////

            let owner = false
            let manager = false
            let newShift = false


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
            let foundShift = null

            const findShift = async (date) => {
                return await db.shift.findUnique({
                    where: {
                        date: date
                    }
                })
            }

            findShift(date).then( resolved => {
                const foundShift = resolved
                return foundShift
            }).then( (foundShift) => {
                // IF TTHERE IS AN EXISTING SHIFT ON THE GIVEN DATE
                if (foundShift != null){
                    console.log("Exisitng  Shift")
                    try{
                        return db.shift.update({
                            where: {
                                id: foundShift.id
                            },
                            data: {
                                allDevices: allDevices,
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
                                allDevices: allDevices,
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
            }).then( resolved => {
                newShift = resolved
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
        
            allDevices.forEach( async (deviceObj) => {                 
                for (let i = 0; i < deviceObj.amount; i++){         
                    if (deviceObj[i].name != 'No Driver Assigned'){
                        findDriver(deviceObj[i].id).then( resolved => {
                            return {shifts: resolved.shifts, deviceObj: deviceObj[i], date: date, i: i}
                        }).then( resolvedObj => {
                            let newShifts
                            if (!resolvedObj.shifts || resolvedObj.shifts == [] || resolvedObj.shifts == null || resolvedObj.shifts == "undefined"){
                                newShifts = [{
                                    date: resolvedObj.date,
                                    [resolvedObj.deviceObj.type]: `${resolvedObj.deviceObj.type}${resolvedObj.i}`
                                }]
                            }
                            else {
                                newShifts = resolvedObj.shifts.filter( shift => {
                                    if (shift.date != resolvedObj.date){
                                        return shift
                                    }
                                })
                                newShifts = [...newShifts, {
                                    date: resolvedObj.date,
                                    [resolvedObj.deviceObj.type]: `${resolvedObj.deviceObj.type}${resolvedObj.i}`
                                }]
                            }
                            return {shifts: newShifts, deviceObj: deviceObj[i], date: resolvedObj.date} 
                        }).then( async (resolved) => {
                            // console.log("This should be an object with all the return information")
                            console.log(resolved)
                            const driver = await db.driver.update({
                                where: {
                                    id: resolved.deviceObj.id
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

            return findShift(date).then( resolved => {
                console.log(resolved)
                return resolved
            }).then( resolved => {
                return resolved
            })
        }
    }
}