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
                try{
                    return await db.driver.findUnique({
                        where: {
                            id: guestId
                        }
                    })
                } catch(err){
                    console.log(err)
                }
            }

            const editChat = async (newOwner) => {
                try{
                    return await db.chatroom.update({
                        where: {
                            id: chatId
                        },
                        data: {
                            chatroomOwner: newOwner
                        }
                    })
                } catch(err){
                    console.log(err)
                }
            }

            /////////////////
            // The Process //
            /////////////////

            let foundDriver = findDriver()

            console.log(foundDriver)

            return findDriver().then( resolved =>{
                console.log(resolved)
                return editChat(resolved)
            })
        }
    }
}