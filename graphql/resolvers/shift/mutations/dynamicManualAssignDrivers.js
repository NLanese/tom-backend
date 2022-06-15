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
                    throw new Error(error)
                }
            }

            // Creates a new shift if one does not exist
            const createNewShiftOnDate = async (date, dateDsp) => {
                try{
                    return await db.shift.create({
                        data: {
                            date: date,
                            dateDsp: dateDsp,
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

            let i = 0

            //////////////////////////////////////////
            ///      Update Drivers and Shift      ///
            //////////////////////////////////////////

            let foundShift = await findShift(dateDsp)
            if (!foundShift){
                foundShift = await createNewShiftOnDate(date, dateDsp)
            }


            let newAllDriverShifts = [...foundShift.allDriverShifts]

            for (i = 0; i < driverIds.length; i ++){
                let driverId = driverIds[i]
                findDriverById(driverId).then(  (resolvedDriver) => {
                    let newShifts = [...resolvedDriver.shifts, {date: date, devices: []}]
                    updateDriverByIdWithShift(driverId, newShifts)
                    newAllDriverShifts.push(
                        {
                            driver: {
                                firstname: resolvedDriver.firstname,
                                lastname: resolvedDriver.lastname,
                                id: resolvedDriver.id,
                                dspId: resolvedDriver.dspId
                            },
                            devices: []
                        }
                    )
                   updateShiftByDate(dateDsp, newAllDriverShifts)
                })
            }

            return await findShift(dateDsp)
        }
    }
}