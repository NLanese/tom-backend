import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicSendMessage: async (_, {
            role,
            chatroomId,
            content,
            token,
            sentAt
        }) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)

            if (owner) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    }
                })

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                try {
                    const newMessage = await db.messages.create({
                        data: {
                            owner: {
                                connect: {
                                    id: owner.id
                                }
                            },
                            chatroom: {
                                connect: {
                                    id: chatroomId
                                }
                            },
                            content: content,
                            from: foundOwner,
                            sentAt: sentAt
                        }
                    })

                    // Create new chat room notification
                    const newNotification = await db.notifications.create({
                        data: {
                            chatroom: {
                                connect: {
                                    id: chatroomId
                                }
                            },
                            content: content,
                            sentAt: sentAt,
                            date: sentAt,
                        }
                    })

                    return await db.chatroom.findUnique({
                        where: {
                            id: newMessage.chatroomId
                        },
                        include: {
                            messages: true
                        }
                        
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    }
                })

                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

                try {
                    return await db.messages.create({
                        data: {
                            manager: {
                                connect: {
                                    id: manager.id
                                }
                            },
                            chatroom: {
                                connect: {
                                    id: chatroomId
                                }
                            },
                            content: content,
                            from: foundManager
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