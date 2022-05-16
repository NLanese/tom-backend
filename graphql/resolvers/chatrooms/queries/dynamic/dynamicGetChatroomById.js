import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        dynamicGetChatroomById: async (_, {
            role,
            token,
            chatroomId
        }) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)

            const chatroomCheck = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                }
            })

            if (!chatroomCheck) {
                throw new Error('Chatroom does not exist')
            }

            if (owner || manager) {
                try {
                    return await db.chatroom.findUnique({
                        where: {
                            id: chatroomId
                        },
                        include: {
                            owner: true,
                            managers: true,
                            drivers: true,
                            messages: true 
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
            else{
                throw new Error("No owner or manager found")
            }
        }
    }
}