import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicUpdateChatroom: async (_, {
            role,
            chatroomId,
            name,
            token
        }, context) => {
            let owner;
            let manager;
            let driver;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)
            if (role === 'DRIVER') driver = await checkDriverAuth(context)

            const foundChatroom = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                },
                include: {
                    owner: true,
                    managers: true,
                    drivers: true
                }
            })

            if (!foundChatroom) throw new Error('Chatroom does not exist')

            if (owner || manager || driver) {
                try {
                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            chatroomName: name
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error('Role not authorized')
        }
    }
}