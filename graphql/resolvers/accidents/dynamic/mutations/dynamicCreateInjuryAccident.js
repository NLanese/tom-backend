import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";
import handleDriverAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        dynamicCreateInjuryAccident: async (_, {
            role,
            accidentId,
            driverId,
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

            await handleDriverAccidentOwnership(driverId, accidentId)

            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }

            if (collisionAccidentId === undefined && propertyAccidentId === undefined) {
                const foundAccident = await db.accident.findUnique({
                    where: {
                        id: accidentId
                    }
                })
    
                if (!foundAccident) {
                    throw new Error("Accident does not exist")
                }
                
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
                const foundPropertyAccident = await db.propertyAccident.findUnique({
                    where: {
                        id: propertyAccidentId
                    }
                })

                if (!foundPropertyAccident) {
                    throw new Error('Accident does not exist')
                }

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
                const foundCollisionAccident = await db.collisionAccident.findUnique({
                    where: {
                        id: collisionAccidentId
                    }
                })

                if (!foundCollisionAccident) {
                    throw new Error("Accident does not exist")
                }

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