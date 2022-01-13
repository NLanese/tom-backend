import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkDriverAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import db from '../../utils/generatePrisma.js';
import handleAccidentOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleAccidentOwnership.js';
import handleAdminHitPersonOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminHitPersonOwnership.js';
import handleHitPersonOwnership from '../../utils/handleOwnership/handleDriverOwnership/handleHitPersonOwnership.js';

export default {
    Mutation: {
        // ------- CREATE --------
        createHitPerson: async (_, {
            accidentId,
            medical_attention,
            vehicle_or_pedestrian,
            previous_damage,
            contact_infomation,
            injury
        }, context) => {
            const driver = await checkDriverAuth(context)
            const verified = await handleAccidentOwnership(driver.id, accidentId)

            try {
                if (verified) {
                    return await db.hitPerson.create({
                        data: {
                            accident: {
                                connect: {
                                    id: accidentId
                                }
                            },
                            accidentId: accidentId,
                            medical_attention: medical_attention,
                            vehicle_or_pedestrian: vehicle_or_pedestrian,
                            previous_damage: previous_damage,
                            contact_infomation: contact_infomation,
                            injury: injury
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },


        // ------- UPDATE --------
        updateHitPerson: async (_, {
            hitPersonId,
            medical_attention,
            vehicle_or_pedestrian,
            previous_damage,
            contact_infomation,
            injury
        }, context) => {
            const driver = await checkDriverAuth(context)
            const hitPerson = await db.hitPerson.findUnique({
                where: {
                    id: hitPersonId
                }
            })

            if (!hitPerson) {
                throw new Error('Error: Hit person record does not exist')
            }

            const verified = await handleHitPersonOwnership(driver.id, hitPersonId)
            try {
                if (verified) {
                    return await db.hitPerson.update({
                        where: {
                            id: hitPersonId
                        },
                        data: {
                            medical_attention: medical_attention,
                            vehicle_or_pedestrian: vehicle_or_pedestrian,
                            previous_damage: previous_damage,
                            contact_infomation: contact_infomation,
                            injury: injury
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },



        adminUpdateHitPerson: async (_, {
            hitPersonId,
            medical_attention,
            vehicle_or_pedestrian,
            previous_damage,
            contact_infomation,
            injury
        }, context) => {
            const admin = await checkAdminAuth(context)
            const hitPerson = await db.hitPerson.findUnique({
                where: {
                    id: hitPersonId
                }
            })
            if (!hitPerson) {
                throw new Error('Error: Hit person record does not exist')
            }

            const verified = await handleAdminHitPersonOwnership(admin.id, hitPersonId)
            try {
                if (verified) {
                    return await db.hitPerson.update({
                        where: {
                            id: hitPersonId
                        },
                        data: {
                            medical_attention: medical_attention,
                            vehicle_or_pedestrian: vehicle_or_pedestrian,
                            previous_damage: previous_damage,
                            contact_infomation: contact_infomation,
                            injury: injury
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },




        // ------- DELETE --------
        deleteHitPerson: async (_, {
            hitPersonId
        }, context) => {
            const admin = await checkAdminAuth(context)

            const hitPerson = await db.hitPerson.findUnique({
                where: {
                    id: hitPersonId
                }
            })

            if (!hitPerson) {
                throw new Error("Error: Hit Person record does not exist")
            }
            const verified = await handleAdminHitPersonOwnership(admin.id, hitPersonId)

            await db.hitPerson.update({
                where: {
                    id: hitPersonId
                },
                data: {
                    deleted: true
                }
            })

            try {
                if (verified) {
                    return await db.hitPerson.delete({
                        where: {
                            id: hitPersonId
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}