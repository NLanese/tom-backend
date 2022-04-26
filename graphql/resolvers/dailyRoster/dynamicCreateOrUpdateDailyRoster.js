import db from '../../../utils/generatePrisma.js'
import checkOwnerAuth from '../../../utils/checkAuthorization/check-owner-auth.js';
import checkManagerAuth from "../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation :{
        dynamicCreateOrUpdateDailyRoster: async (_, {
            token, 
            role,
            date,
            driverIds
        }) => {

            ///////////////////////////////
            ///     Async Functions     ///
            ///////////////////////////////

            // Finder Function
            const findDailyRoster = async () => {
                return await db.dailyRoster.findUnique({
                    where: {
                        date: date
                    }
                })
            }

            // Creates the Daily Roster
            const createDailyRoster = async () => {
                return await db.dailyRoster.create({
                    data: {
                        date: date
                    }
                })
            }

            // Applies driver connections to a newly created DR,
            // or updates the driver connections to an existing one
            const updateDailyRoster = async (rosterId) => {
                driverIds.forEach( async (driverId) =>  {
                    return await db.dailyRoster.update({
                        where: {
                            id: rosterId
                        },
                        drivers: {
                            connect: {
                                id: driverId
                            }
                        }
                    })
                })
            }

            // If the DR alreayd exists, run this to clear its current drivers.
            // This will allow the update to add new and existing drivers wihtout
            // duplication
            const clearDailyRoster = async () => {
                return await db.dailyRoster.update({
                    where: {
                        date: date
                    },
                    data: {
                        drivers: []
                    }
                })
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
            
            return findDailyRoster(date).then(resolved => {

                // There is an already existing Daily
                if (resolved){
                    return clearDailyRoster().then( resolved => {
                        return updateDailyRoster(resolved.id).then(resolved => {
                            console.log(resolved)
                            return resolved
                        })
                    })
                }

                // There is not an existing Daily
                else{
                    return createDailyRoster().then( resolved => {
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