import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        driverCreateInjuryAccident: async (_, {
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

            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverAccidentOwnership(driver.id, accidentId)

            if (collisionAccidentId === undefined && propertyAccidentId === undefined) {
                try {
                    return await db.injuryAccident.create({
                        data: {
                            medical_attention: medical_attention,
                            immediate_attention: immediate_attention,
                            injury: injury,
                            contact_info: contact_info,
                            specific_pictures: specific_pictures,
                            pain_level: pain_level,
                            extra_info: extra_info,
                            accident: {
                                connect: {
                                    id: accidentId
                                }
                            },
                            accidentId: accidentId   
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (propertyAccidentId !== undefined) {
                try {
                    return await db.injuryAccident.create({
                        data: {
                            medical_attention: medical_attention,
                            immediate_attention: immediate_attention,
                            injury: injury,
                            contact_info: contact_info,
                            specific_pictures: specific_pictures,
                            pain_level: pain_level,
                            extra_info: extra_info,
                            propertyAccident: {
                                connect: {
                                    id: propertyAccidentId
                                }
                            },
                            accidentId: accidentId   
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (collisionAccidentId !== undefined) {
                try {
                    return await db.injuryAccident.create({
                        data: {
                            medical_attention: medical_attention,
                            immediate_attention: immediate_attention,
                            injury: injury,
                            contact_info: contact_info,
                            specific_pictures: specific_pictures,
                            pain_level: pain_level,
                            extra_info: extra_info,
                            collisionAccident: {
                                connect: {
                                    id: collisionAccidentId
                                }
                            },
                            accidentId: accidentId   
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}