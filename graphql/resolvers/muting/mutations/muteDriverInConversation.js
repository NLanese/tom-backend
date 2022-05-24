import db from "../../../../utils/generatePrisma";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth";

export default {
    Mutation: {
        muteDriverInConversation: (_, {chatId, driverId, role, token}) => {
            /////////////////
            //  Ownership  //
            /////////////////
            let user
            if (role == "OWNER"){
                user = checkOwnerAuth(token)
            }
            if (role == "MANAGER"){
                user = checkManagerAuth(token)
            }


            if (!user){
                throw new Error("Invalid User Token")
            }
            ////////////////
            // DB Actions //
            ////////////////

            const findChatroom = async () => {
                return await db.chatroom.findUnique({
                    where: {
                        id: chatId
                    }
                })
            }

            const updateChatroom = async (newMutedList) => {
                return await db.chatroom.update({
                    where: {
                        id: chatId
                    },
                    data: {
                        mutedDrivers: newMutedList
                    }
                })
            }

            const findDriver = async () => {
                return await db.driver.findUnique({
                    where: {
                        id: driverId
                    }
                })
            }

            /////////////////
            // The Process //
            /////////////////

            let foundChat = findChatroom() 
            if (!foundChat){
                throw new Error("Invalid Chat ID")
            }

            let foundMuted = foundChat.mutedDrivers

            let foundDriver = findDriver()
            if (!foundDriver){
                throw new Error("Invalid Driver ID")
            }

            let newDriverObj = {
                firstname: foundDriver.firstname,
                lastname: foundDriver.lastname,
                id: foundDriver.id,
                profilePick: foundDriver.profilePick
            }

            let newMutedArray = [...foundMuted, newDriverObj]

            return updateChatroom(newMutedArray)
        }
    }
}