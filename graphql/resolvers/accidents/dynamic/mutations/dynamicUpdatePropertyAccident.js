import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverPropertyAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverPropertyAccidentOwnership.js"

export default {
    Mutation: {
        dynamicUpdatePropertyAccident: async (_, {
            role,
            propertyAccidentId,
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

            const foundPropertyAccident = await db.propertyAccident.findUnique({
                where: {
                    id: propertyAccidentId
                }
            })

            if (!foundPropertyAccident) {
                throw new Error("Property Accident does not exist")
            }

            await handleDriverPropertyAccidentOwnership(driverId, propertyAccidentId)

            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }

            try {
                return await db.propertyAccident.update({
                    where: {
                        id: propertyAccidentId
                    },
                    data: {
                        address: address,
                        object_hit: object_hit,
                        specific_pictures: specific_pictures,
                        safety_equipment: safety_equipment,
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