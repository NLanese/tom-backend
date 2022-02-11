import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicRemoveMessage: async (_, {
            role,
            messageId
        }, context) => {
            let owner;
            let manager;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            if (owner || manager) {
                return await db.messages.update({
                    where: {
                        id: messageId
                    },
                    data: {
                        visable: false
                    }
                })
            }
        }
    }
}