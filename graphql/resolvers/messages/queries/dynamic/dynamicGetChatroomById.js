import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";

export default {
    Query: {
        dynamicGetChatroomById: async (_, {
            role,
            chatroomId
        }, context) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner || manager) {
                try {
                    return await db.chatroom.findUnique({
                        where: {
                            id: chatroomId
                        },
                        include: {
                            owner: true,
                            managers: true,
                            drivers: true,
                            messages: {
                                orderBy: [
                                    {
                                        id: "desc"
                                    }
                                ]
                            }
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