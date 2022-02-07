import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";

export default {
    Mutation: {
        dynamicSendMessage: async (_, {
            role,
            chatroomId,
            content
        }, context) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner) {
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    }
                })

                try {
                    return await db.messages.create({
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
                            from: foundOwner
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                const foundManager = await db.admin.findUnique({
                    where: {
                        id: manager.id
                    }
                })

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

            throw new Error('Role not authorized')
        }
    }
}