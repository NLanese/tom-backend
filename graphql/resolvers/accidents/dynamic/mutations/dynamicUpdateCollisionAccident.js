import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverCollisionAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverCollisionAccidentOwnership.js";


export default {
    Mutation: {
        dynamicUpdateCollisionAccident: async (_, {
            role,
            collisionAccidentId,
            driverId,
            specific_pictures,
            contact_info,
            extra_info
        }, context) => {
            let owner;
            let manager;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) {
                throw new Error('Driver does not exist')
            }

            const foundAccident = await db.collisionAccident.findUnique({
                where: {
                    id: collisionAccidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverCollisionAccidentOwnership(driverId, collisionAccidentId)

            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }

            try {
                return await db.collisionAccident.update({
                    where: {
                        id: collisionAccidentId
                    },
                    data: {
                        specific_pictures: specific_pictures,
                        contact_info: contact_info,
                        extra_info: extra_info
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}