import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicAddDriverToChatroom: async (_, {
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

            if (foundChatroom.chatroomOwner.id !== owner.id || foundChatroom.chatroomOwner.id !== manager.id || !foundChatroom.chatroomOwner.id !== driver.id) {
                throw new Error('You are not the chatroom owner')
            }

            let guests = foundChatroom.guests
            await guests.push(foundDriver)

            if (owner || manager || driver) {
                try {
                    await db.driver.update({
                        where: {
                            id: foundDriver.id
                        },
                        data: {
                            chatrooms: {
                                connect: {
                                    id: chatroomId
                                }
                            }
                        }
                    })

                    return await db.chatroom.update({
                        where: {
                            id: chatroomId
                        },
                        data: {
                            guests: guests,
                            drivers: {
                                connect: {
                                    id: foundDriver.id
                                }
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error('Something went wrong. Please try again')
        }
    }
}
