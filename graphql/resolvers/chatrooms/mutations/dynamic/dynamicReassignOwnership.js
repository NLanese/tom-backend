import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Mutation: {
        dynamicReassignOwnership: async (_, {
            role,
            guestId,
            chatId,
            token,
        }, context) => {
            ///////////////
            // Ownership // 
            ///////////////
            let user;
            if (role === "OWNER"){ user = checkOwnerAuth(token)}
            if (role === "MANAGER"){ user = checkManagerAuth(token)}
            if (role === "DRIVER"){ user = checkManagerAuth(context)}

            if (!user){
                throw new Error("No valid account with the submitted crudentials")
            }

            /////////////////
            // The Process // 
            /////////////////

            const findDriver = async () => {
                return await db.driver.findUnique({
                    id: guestId
                })
            }

            const editChat = async (newOwner) => {
                return await db.chatroom.update({
                    where: {
                        id: chatId
                    },
                    data: {
                        chatroomOwner: newOwner
                    }
                })
            }

            /////////////////
            // The Process //
            /////////////////

            return findDriver().then( resolved =>{
                return editChat(resolved)
            })
        }
    }
}