import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        dynamicGetAccidentById: async (_, {
            role,
            accidentId,
            driverId
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

            try {
                return await db.accident.findUnique({
                    where: {
                        id: accidentId
                    },
                    include: {
                        propertyAccident: {
                            include: {
                                injuryAccident: true
                            }
                        },
                        collisionAccident: {
                            include: {
                                injuryAccident: true
                            }
                        },
                        injuryAccident: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }

        }
    }
}