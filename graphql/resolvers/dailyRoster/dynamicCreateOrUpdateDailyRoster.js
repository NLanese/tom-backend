import db from '../../../utils/generatePrisma.js'
import checkOwnerAuth from '../../../utils/checkAuthorization/check-owner-auth.js';
import checkManagerAuth from "../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateDailyRoster: async (_, {
            token, 
            role,
            date,
            driverIds,
            dspId
        }) => {

            ///////////////////////////////
            ///     Async Functions     ///
            ///////////////////////////////

            // Finder Function
            const findDailyRoster = async () => {
                try{
                    return await db.dailyRoster.findUnique({
                        where: {
                            date: date
                        }
                    })
                }
                catch (err){
                    console.log(err)
                }
            }

            // Creates the Daily Roster
            const createDailyRoster = async () => {
                try{
                    return await db.dailyRoster.create({
                        data: {
                            date: date,
                            dsp: {
                                connect: {
                                    id: dspId
                                }
                            }
                        }
                    })
                } catch(err){
                    console.log(err)
                }
            }

            // Applies driver connections to a newly created DR,
            // or updates the driver connections to an existing one
            const updateDailyRoster = async (rosterId) => {
                return driverIds.forEach( async (driverId) =>  {
                    console.log(driverId)
                    try{
                        return await db.dailyRoster.update({
                            where: {
                                id: rosterId
                            },
                            data: {
                                drivers: {
                                    connect: {
                                        id: driverId
                                    }
                                }
                            }
                        })
                    }
                    catch(err){
                        console.log(err)
                    }
                })
            }

            // If the DR alreayd exists, run this to clear its current drivers.
            // This will allow the update to add new and existing drivers wihtout
            // duplication
            const clearDailyRoster = async () => {
                try {
                    return await db.dailyRoster.update({
                        where: {
                            date: date
                        },
                        data: {
                            drivers: []
                        }
                    })
                } catch(err){
                    console.log(err)
                }
            }



            console.log("\n\n-=-=-=-=-=-=-=-=-=-=-=-")

            ///////////////////////////////
            ///        Ownership        ///
            ///////////////////////////////

            let mutator = false


            if (role == "OWNER"){
                mutator = checkOwnerAuth(token)
            }
            else if(role == "MANAGER"){
                mutator = checkManagerAuth(token)
            }
            else {
                throw new Error("Invalid ROLE Access, please make sure you are properly signed in")
            }


            ///////////////////////////////
            ///    Update or Create     ///
            ///////////////////////////////
            
            console.log("Trying to find previously existing roster for the same date\n")
            return findDailyRoster(date).then(resolved => {

                // There is an already existing Daily
                if (resolved){
                    console.log("Found a Roster\n")
                    return updateDailyRoster(resolved.id).then(resolved => {
                        console.log("Roster updated")
                        console.log(resolved)
                        return resolved
                    })
                }

                // There is not an existing Daily
                else{
                    console.log("Did not find roster on this date\n")
                    return createDailyRoster().then( resolved => {
                        console.log("Roster Created\n")
                        console.log(resolved)
                        return updateDailyRoster(resolved.id).then(resolved => {
                            console.log(resolved)
                            return resolved
                        })
                    })
                }
            })

        }
    }
}