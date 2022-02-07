import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Query: {
        driverGetChatroomById: async (_, {
            chatroomId
        }, context) => {
            const driver = await checkDriverAuth(context)

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