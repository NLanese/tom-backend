import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Mutation: {
        unmuteDriverInConversation: (_, {chatId, driverId, role, token}) => {
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
                        mutedIds: newMutedList
                    }
                })
            }

            /////////////////
            // The Process //
            /////////////////

            findChatroom().then(chatroom => {
                let newMutedArray = chatroom.mutedIds.filter(userId => userId !== driverId)
                return updateChatroom(newMutedArray)
            }).catch(e => {
                throw new Error("Invalid Chat ID")
            })

        }
    }
}