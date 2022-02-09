import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicAddOwnerToChatroom: async (_, {
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

            const foundOwner = await db.owner.findUnique({
                where: {
                    id: guestId
                }
            })

            if (!foundChatroom) throw new Error('Chatroom does not exist')
            if (!foundOwner) throw new Error('Owner does not exist')

            let guests = foundChatroom.guests
            await guests.push(foundOwner)

            if (owner || manager || driver) {
                await db.owner.update({
                    where: {
                        id: foundOwner.id
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
                        owner: {
                            connect: {
                                id: foundOwner.id
                            }
                        }
                    }
                })
            }

            throw new Error('Role not authorized')
        }
    }
}