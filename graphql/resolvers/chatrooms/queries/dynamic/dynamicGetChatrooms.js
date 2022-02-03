import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";

// OWNER ONLY SO FAR
export default {
    Query: {
        dynamicGetChatrooms: async (_, {
            role
        }, context) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner) {
                try {
                    return await db.chatroom.findMany({
                        include: {
                            owner: true,
                            managers: true,
                            drivers: true,
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}