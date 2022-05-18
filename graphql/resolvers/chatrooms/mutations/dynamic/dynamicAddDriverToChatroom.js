import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleOwnerDriverOwnership from "../../../../../utils/handleOwnership/handleOwnerOwnership/handleOwnerDriverOwnership.js";
import handleManagerDriverOwnership from "../../../../../utils/handleOwnership/handleManagerOwnership/handleManagerDriverOwnership.js";

export default {
    Mutation: {
        dynamicAddDriverToChatroom: async (_, {
            role,
            chatroomId,
            guestId,
            token
        }) => {
            let owner;
            let manager;
            let driver;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)
            if (role === 'DRIVER') driver = await checkDriverAuth(token)

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

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: guestId
                }
            })

            if (!foundChatroom) throw new Error('Chatroom does not exist')
            if (!foundDriver) throw new Error('Driver does not exist')

            let guests = foundChatroom.guests
            await guests.push(foundDriver)

            if (owner || manager || driver) {
                if (owner) {
                    if (foundChatroom.owner.id !== owner.id) {
                        throw new Error("Not a member of that chatroom")
                    }

                    if (foundChatroom.chatroomOwner.id !== owner.id) {
                        throw new Error('You are not the chatroom owner')
                    }

                    await handleOwnerDriverOwnership(owner.id, guestId)
                }

                if (manager) {
                    let managerCheck = false

                    foundChatroom.managers.forEach((chatroomManager) => {
                        if (chatroomManager.id === manager.id) {
                            managerCheck = true
                        }
                    })

                    if (managerCheck === false) {
                        throw new Error('Not a member of that chatroom')
                    }

                    if (foundChatroom.chatroomOwner.id !== manager.id) {
                        throw new Error('You are not the chatroom owner')
                    }

                    await handleManagerDriverOwnership(manager.id, guestId)
                }

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
