import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicRemoveManagerFromChatroom: async (_, {
            role,
            chatroomId,
            guestId
        }, context) => {
            let owner;
            let manager;
            let driver;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)
            if (role === 'DRIVER') driver = await checkDriverAuth(context)

            const foundChatroom = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                }
            })

            const foundManager = await db.manager.findUnique({
                where: {
                    id: guestId
                }
            })

            if (!foundChatroom) throw new Error('Chatroom does not exist')
            if (!foundManager) throw new Error('Manager does not exist')

            let guests = foundChatroom.guests

            await guests.forEach( async (guest, index) => {
                if (guest.id === guestId) {
                    guests.splice(index, 1)

                    await db.manager.update({
                        where: {
                            id: guest.id
                        },
                        data: {
                            chatrooms: {
                                disconnect: {
                                    id: chatroomId
                                }
                            }
                        }
                    })
                }
            })

            if (owner || manager || driver) {
                try {
                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            guests: guests,
                            drivers: {
                                disconnect: {
                                    id: guestId
                                }
                            }
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