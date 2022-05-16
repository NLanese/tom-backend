import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Mutation: {
        driverReadAnnouncement: async(_, {driverId, announcementId, date, time}, context) => {

            ///////////////////////
            //                   //
            //    Verification   //
            //                   //
            ///////////////////////
            const driver = checkDriverAuth(context)
            if (!driver){
                throw new Error("Error, driver account not found")
            }

            ///////////////////////
            //                   //
            //     DB Actions    //
            //                   //
            ///////////////////////

            const findAnnouncement = async () => {
                return await db.announcementMessage.findUnique({
                    where: {
                        id: announcementId
                    }
                })
            }

            const updateAnnouncement = async (newReadList) => {
                return await db.announcementMessage.update({
                    where: {
                        id: announcementId
                    },
                    data: {
                        readBy: newReadList
                    }
                })
            }

            ///////////////////////
            //                   //
            //    The Process    //
            //                   //
            ///////////////////////
            const foundAnnouncement = findAnnouncement()

            if (!foundAnnouncement){
                throw new Error("No Announcement Matching the ID")
            }
            // Creates a smaller driverObj to reduce unnecessary data transfers
            let driverObj = {firstname: driver.firstname, lastname: driver.lastname, id: driver.id, profilePick: driver.profilePick}

            // Creates a new readByList with all past readBys and the newly added one
            let readByList = foundAnnouncement.readBy
            readByList.push({driver: driverObj, readAt: {date: date, time: time}})

            // Runs the update with the new ReadByList
            return updateAnnouncement(readByList)
        }
    }
}