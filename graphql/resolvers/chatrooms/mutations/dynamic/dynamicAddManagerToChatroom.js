import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicAddManagerToChatroom: async (_, {
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
            
            if (foundChatroom.chatroomOwner.id !== owner.id || foundChatroom.chatroomOwner.id !== manager.id || !foundChatroom.chatroomOwner.id !== driver.id) {
                throw new Error('You are not the chatroom owner')
            }

            let guests = foundChatroom.guests
            await guests.push(foundManager)

            if (owner || manager || driver) {
                await db.manager.update({
                    where: {
                        id: foundManager.id
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
                        managers: {
                            connect: {
                                id: foundManager.id
                            }
                        }
                    }
                })
            }

            throw new Error('Something went wrong. Please try again')
        }
    }
}