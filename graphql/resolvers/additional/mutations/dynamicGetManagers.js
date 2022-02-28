import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        dynamicGetManagers: async (_, {
            role
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
                    },
                    include: {
                        managers: true
                    }
                })

                return foundOwner.managers
            }

            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    }
                })

                const foundOwner = await db.owner.findUnique({
                    where:{
                        id: foundManager.ownerId
                    },
                    include: {
                        managers: true
                    }
                })

                return foundOwner.managers
            }

            throw new Error('Role not authorized')
        }
    }
}