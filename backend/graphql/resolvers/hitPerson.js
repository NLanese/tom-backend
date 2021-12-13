import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';

export default{
    Mutation: {

        // ------- CREATE --------
        createHitPerson: async (_, {accidentId, medical_attention, vehicle_or_pedestrian, previous_damage, contact_infomation, injury}, context) => {
            const user = await checkUserAuth(context)
            
            try{
                return await db.hitPerson.create({
                    data: {
                        accident: {
                            id: accidentId
                        },
                        medical_attention: medical_attention,
                        vehicle_or_pedestrian: vehicle_or_pedestrian,
                        previous_damage: previous_damage,
                        contact_infomation: contact_infomation,
                        injury: injury
                    }
                })
            } catch(error){
                throw new Error(error)
            }
        },


        // ------- UPDATE --------
        updateHitPerson: async (_, {hitPersonId, medical_attention, vehicle_or_pedestrian, previous_damage, contact_infomation, injury}, context) => {
            const user = await checkUserAuth(context)
            
            try{
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
            } catch(error){
                throw new Error(error)
            }
        },


        // ------- DELETE --------
        deleteHitPerson: async (_, {hitPersonId}, context) => {
            try{
                // change this to admin = checkAdminAuth later
                const user = await checkUserAuth(context)

                return await db.delete.hitPerson({
                    where: {
                        id: hitPersonId
                    }
                })
            } catch(error){
                throw new Error(error)
            }
        }
    }
}