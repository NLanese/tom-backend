import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        dynamicCreatePropertyAccident: async (_, {
            role,
            accidentId,
            driverId,
            address,
            object_hit,
            specific_pictures,
            safety_equipment,
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

            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverAccidentOwnership(driverId, accidentId)

            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }
        }
    }
}