import db from "../../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverInjuryAccidentOwnership from '../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverInjuryAccidentOwnership.js'

export default {
    Mutation: {
        driverUpdateInjuryAccident: async (_, {
            injuryAccidentId,
            accidentId,
            collisionAccidentId,
            propertyAccidentId,
            medical_attention,
            immediate_attention,
            injury,
            contact_info,
            specific_pictures,
            pain_level,
            extra_info 
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundInjuryAccident = await db.injuryAccident.findUnique({
                where: {
                    id: injuryAccidentId
                }
            })

            if (!foundInjuryAccident) {
                throw new Error("Injury Accident does not exist")
            }

            await handleDriverInjuryAccidentOwnership(driver.id, injuryAccidentId)

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