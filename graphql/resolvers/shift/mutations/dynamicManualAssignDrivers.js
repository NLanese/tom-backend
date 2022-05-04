import db from "../../../../utils/generatePrisma.js"
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicManualAssignDrivers: async (_, {
            token,
            role,
            date,
            driverIds,
            dspId
        }, context) => {

            ///////////////////////////////
            ///    Finders / Mutators   ///
            ///////////////////////////////

            // Finds an existing Driver by ID
            const findDriverById = async (driverId) => {
                try{
                    return await db.driver.findUnique({
                        where: {
                            id: driverId
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

            // Updates a Driver selected by ID with a provided shift (overwrite)
            const updateDriverByIdWithShift = async (driverId, shiftArr) => {
                try{
                    return await db.driver.update({
                        where: {
                            id: driverId
                        },
                        data: {
                            shifts: shiftArr
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

            // Finds a Shift by ID
            const findShift = async (date) => {
                try{
                    return await db.shift.findUnique({
                        where: {
                            date: date
                        },
                        
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

            // Updates a shift's allDriverShifts by Dtae
            const updateShiftByDate = async (date, allDriverShifts) => {
                try{
                    return await db.shift.update({
                        where: {
                            date: date
                        },
                        data: {
                            allDriverShifts: allDriverShifts
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

            // Creates a new shift if one does not exist
            const createNewShiftOnDate = async (date, driverShift) => {
                try{
                    return await db.shift.create({
                        data: {
                            date: date,
                            allDriverShifts: [{...driverShift}],
                            dsp: {
                                connect: {
                                    id: dspId
                                }
                            }
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

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
                console.log("No access")
                throw new Error("No owner or manager with the give crudentials found")
            }

            console.log("Passed access?")

            //////////////////////////////////////////
            ///      Update Drivers and Shift      ///
            //////////////////////////////////////////

            driverIds.forEach( async (driverId) => {

                console.log("In first id")
                
                return findDriverById(driverId).then( async (resolvedDriver) => {

                    // Determines whether or not a shift on this date exists
                    let passing = true
                    resolvedDriver.shifts.forEach( async (shift, index) => {
                        if (shift.date == date){
                            passing = false
                        }
                    })

                    console.log("Passed driverFindShift?")

                    // If there is no shift on this date
                    if (passing){
                        let newShifts = [...resolvedDriver.shifts, {date: date, devices: []}]
                        await updateDriverByIdWithShift(driverId, newShifts)
                    }

                    // If there is a shift on this date
                    if (!passing){
                        return 
                    }

                    console.log("Passed driverShiftExist?")

                    /////////////////////////////////////
                    ///     Update or Create Shift    ///
                    /////////////////////////////////////

                    return findShift(date).then( async (resolvedShift) => {

                        console.log("Passed shiftExist?")

                        // If there is a shift on this date
                        if (resolvedShift){
                            let newShift = resolvedShift
                            let newAllDriverShifts = [...newShift.allDriverShifts, {driver: resolvedDriver, devices: []}]
                            return updateShiftByDate(date, newAllDriverShifts).then(resolvedShiftTwo => {
                                console.log(resolvedShiftTwo)
                                return resolvedShiftTwo
                            })
                        }

                        // If there is no shift on this date
                        if (!resolvedShift){
                            return createNewShiftOnDate(date, {driver: resolvedDriver, devices: []}).then(resolvedShiftTwo => {
                                console.log(resolvedShiftTwo)
                                return resolvedShiftTwo
                            })
                        }
                    })
                })

            })


            return await findShift(date)



        }
    }
}