import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        driverSendMessage: async (_, {
            chatroomId,
            content
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                }
            })

            if (!foundDriver) {
                throw new Error('Driver does not exist')
            }

            const foundChatroom = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                }
            })

            if (!foundChatroom) {
                throw new Error('Chatroom does not exist')
            }
            
            try {
                return await db.messages.create({
                    data: {
                        driver: {
                            connect: {
                                id: driver.id
                            }
                        },
                        chatroom: {
                            connect: {
                                id: chatroomId
                            }
                        },
                        content: content,
                        from: foundDriver
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}