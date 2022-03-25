import db from "../../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverInjuryAccidentOwnership from '../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverInjuryAccidentOwnership.js'

export default {
    Mutation: {
        dynamicUpdateInjuryAccident: async (_, {
            role,
            injuryAccidentId,
            driverId,
            medical_attention,
            immediate_attention,
            injury,
            contact_info,
            specific_pictures,
            pain_level,
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

            await handleDriverInjuryAccidentOwnership(driverId, injuryAccidentId)
        
            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }

            try {
                return await db.injuryAccident.update({
                    where: {
                        id: injuryAccidentId
                    },
                    data: {
                        medical_attention: medical_attention,
                        immediate_attention: immediate_attention,
                        injury: injury,
                        contact_info: contact_info,
                        specific_pictures: specific_pictures,
                        pain_level: pain_level,
                        extra_info: extra_info,
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}