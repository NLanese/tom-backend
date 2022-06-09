import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

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
                        mutedIds: newMutedList
                    }
                })
            }

            // const findDriver = async () => {
            //     return await db.driver.findUnique({
            //         where: {
            //             id: driverId
            //         }
            //     })
            // }

            /////////////////
            // The Process //
            /////////////////
            let newMutedArray
            findChatroom().then(chatroom =>{
                newMutedArray = [...chatroom.mutedIds, driverId]
                return updateChatroom(newMutedArray)
            }).catch(e => {
                console.log(e)
                 throw new Error("Invalid Chat ID")
            }) 
            

           

            // let foundDriver = findDriver()
            // if (!foundDriver){
            //     throw new Error("Invalid Driver ID")
            // }

            // let newDriverObj = {
            //     firstname: foundDriver.firstname,
            //     lastname: foundDriver.lastname,
            //     id: foundDriver.id,
            //     profilePick: foundDriver.profilePick
            // }
            // let newMutedArray = Object.assign([], foundMuted, driverId)
            
            

            
        }
    }
}