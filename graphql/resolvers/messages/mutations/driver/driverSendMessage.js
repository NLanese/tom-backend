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
                console.log(error)
                throw new Error(error)
            }
        }
    }
}