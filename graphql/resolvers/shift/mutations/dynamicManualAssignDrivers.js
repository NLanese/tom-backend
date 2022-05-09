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
            const findShift = async (dateDsp) => {
                try{
                    return await db.shift.findUnique({
                        where: {
                            dateDsp: dateDsp
                        },
                        
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }

            // Updates a shift's allDriverShifts by Dtae
            const updateShiftByDate = async (dateDsp, allDriverShifts) => {
                try{
                    return await db.shift.update({
                        where: {
                            dateDsp: dateDsp
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
            const createNewShiftOnDate = async (date, driverShift, dateDsp) => {
                try{
                    return await db.shift.create({
                        data: {
                            date: date,
                            dateDsp: dateDsp,
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

            // Finds the DSP which this shift will be added to
            const findDspById = async (dspId) => {
                return await db.dsp.findUnique({
                    where: {
                        id: dspId
                    },
                    include: {
                        shifts: true
                    }
                })
            }

            let globalFoundShift = false

            ///////////////////////////////
            ///        Ownership        ///
            ///////////////////////////////

            let owner = false
            let manager = false
            const dateDsp = `${date}${dspId}`

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

            console.log("Passed access...")
            let i = 0

            //////////////////////////////////////////
            ///      Update Drivers and Shift      ///
            //////////////////////////////////////////


            return await driverIds.map(  (driverId) => {
                i = i + 1 

                // Finds if a shift with this dateDsp exists
                findShift(dateDsp).then(  foundShift => {


                    return findDriverById(driverId).then(  (resolvedDriver) => {

                        // Determines whether or not a shift on this date exists
                        let passing = true
                        resolvedDriver.shifts.forEach( (shift, index) => {
                            console.log(shift, "Driver Shift")
                            if (shift.date == date){
                                passing = false
                            }
                        })
    
                        // If there is no shift on this date
                        if (passing){
                            let newShifts = [...resolvedDriver.shifts, {date: date, devices: []}]
                             updateDriverByIdWithShift(driverId, newShifts)
                        }
    
                        // If there is a shift on this date
                        if (!passing){
                        }

                        // If there is a shift on this date
                        if (foundShift){
                            let newAllDriverShifts = [...foundShift.allDriverShifts, {driver: resolvedDriver, devices: []}]
                            return  updateShiftByDate(dateDsp, newAllDriverShifts).then( async (resolvedShiftTwo) => {
                                return  resolvedShiftTwo
                            })
                        }

                        // If there is no shift on this date
                        if (!foundShift){
                            return  createNewShiftOnDate(date, {driver: resolvedDriver, devices: []}, dateDsp).then( async (resolvedShiftTwo) => {
                                return  resolvedShiftTwo
                            })
                        }
                })
                
                
                


                    /////////////////////////////////////
                    ///     Update or Create Shift    ///
                    /////////////////////////////////////

                    // return await findShift(dateDsp).then( async (resolvedShift) => {


                        
                    // })
                })

            })
        }
    }
}