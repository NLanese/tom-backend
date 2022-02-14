import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Query: {
        driverGetChatroomById: async (_, {
            chatroomId
        }, context) => {
            const driver = await checkDriverAuth(context)

            const chatroomCheck = await db.chatroom.findUnique({
                where: {
                    id: chatroomId
                }
            })

            if (!chatroomCheck) {
                throw new Error('Chatrom does not exist')
            }

            try {
                return await db.chatroom.findUnique({
                    where: {
                        id: chatroomId
                    },
                    include: {
                        owner: true,
                        managers: true,
                        drivers: true,
                        messages: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}