import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        dynamicFindAllAnnouncements: async (_, { role, token }) => {
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
           const findDsp = async () => {
               return await db.dsp.findUnique({
                   where: {
                       id: admin.dsp.id
                   }
               })
           }

           const findAnnouncements = async (dspId) => {
               return await db.announcementMessages.findMany({
                   where: {
                       id: dspId
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

            return findAnnouncements(foundDsp.id)
        }
    }
}