import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';
import { handleAccidentOwnership } from '../../utils/handleOwnership/handleAccidentOwnership.js';
import handleAdminHitPersonDeleteOwnership from '../../utils/handleOwnership/handleAdminHitPersonDeleteOwnership.js';

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
            const user = await checkUserAuth(context)
            const verified = await handleAccidentOwnership(user.id, accidentId)

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
            const user = await checkUserAuth(context)
            const hitPerson = await db.hitPerson.findUnique({
                where: {
                    id: hitPersonId
                }
            })

            if (!hitPerson) {
                throw new Error('Error: Hit person record does not exist')
            }

            const verified = await handleAdminHitPersonDeleteOwnership(user.id, hitPersonId)
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
        deleteHitPerson: async (_, {hitPersonId}, context) => {
            const admin = await checkAdminAuth(context)
<<<<<<< HEAD

=======
>>>>>>> fcc3f8d79681ad99869556f44cbd5dc7b4905177
            const hitPerson = await db.hitPerson.findUnique({
                where: {
                    id: hitPersonId
                }
            })

            if (!hitPerson) {
                throw new Error('Error: Hit person record does not exist')
            }

            const verified = await handleAdminHitPersonDeleteOwnership(admin.id, hitPersonId)
            
            try{
                if (verified){
                    return await db.hitPerson.delete({
                        where: {
                            id: hitPersonId
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}