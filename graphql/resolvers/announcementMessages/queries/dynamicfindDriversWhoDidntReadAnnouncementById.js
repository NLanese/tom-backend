import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        dynamicFindAllAnnouncements: async (_, { role, token, announcementId}) => {
           /////////////////////////
           //                     //
           //     Preliminary     //
           //                     //
           /////////////////////////
           let admin = false
           if (role === "OWNER"){
               let admin = checkOwnerAuth(token)
           }
           if (role === "MANAGER"){
               let admin = checkManagerAuth(token)
           }
           if (!admin){
               throw new Error("Invalid user attempting access")
           }

           /////////////////////////
           //                     //
           //      DB Actions     //
           //                     //
           /////////////////////////
           
           // Finds the DSP
           const findDsp = async () => {
                return await db.dsp.findUnique({
                    where: {
                        id: admin.dsp.id
                    }
                })
            }

            // Finds the announcement 
            const findAnnouncement = async () => {
                return await db.announcementMessages.findUnique({
                    where: {
                        id: announcementId
                    }
                })
            }

            // Find all Drivers in the Dsp, thus all drivers in the Announcements Chat
            const findAllDrivers = async (dspId) => {
                return await db.drivers.findMany({
                    where: {
                        dspId: dspId
                    }
                })
            }

           /////////////////////////
           //                     //
           //     The Process     //
           //                     //
           /////////////////////////

            const foundDsp = findDsp()
            if (!foundDsp){
                throw new Error("Error, there was an issue finding the current user's dsp")
            }

            const foundAnnouncement = findAnnouncement()
            if (!foundAnnouncement){
                throw new Error("Error there was no announcement with this Id")
            }

            let allDrivers = findAllDrivers(foundDsp.id)
            let allNonRead = allDrivers.filter( driver => {
                let passing = true
                let foundDriverEntry = foundAnnouncement.readBy.find( readByEntry => {
                    readByEntry.driver.id === driver.id
                })
                if (foundDriverEntry){
                    passing = false
                }
                if (passing){
                    return driver
                }
            })

            return allNonRead
        }
    }
}