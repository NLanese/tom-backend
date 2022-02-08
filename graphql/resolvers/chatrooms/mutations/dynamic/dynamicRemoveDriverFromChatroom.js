import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicRemoveDriverFromChatroom: async (_, {
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

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: guestId
                }
            })

            if (!foundChatroom) throw new Error('Chatroom does not exist')
            if (!foundDriver) throw new Error('Driver does not exist')

            let guests = foundChatroom.guests

            await guests.forEach( async (guest, index) => {
                if (guest.id === guestId) {
                    guests.splice(index, 1)

                    await db.driver.update({
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
        }
    }
}
