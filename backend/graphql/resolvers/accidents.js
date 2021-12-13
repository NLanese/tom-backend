import checkUserAuth from '../../utils/checkAuthorization/check-user-auth.js';
import db from '../../utils/generatePrisma.js';

export default{
    Query: {
        getAccidents: async (_, {}, context) => {
            const user = await checkUserAuth(context)

            try {
                return await db.accident.findMany({
                    where: {
                        id: user.id
                    },
                })
            } catch (error) {
                throw new Error(error)
            }

        }
    }, 

    Mutation: {
        createAccident: async (_, { using_safety, safety_failed, number_package_carried, safety_equipment_used, failed_safety }, context) => {
            const user = await checkUserAuth(context)
            
            try{
                return db.accident.create({
                    data: {
                        using_safety: using_safety,
                        safety_failed: safety_failed,
                        number_package_carried: number_package_carried,
                        safety_equipment_used: safety_equipment_used,
                        failed_safety: failed_safety,
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                })
            } catch(error){
                throw new Error(console.log(error))
            }
        },


        updateAccident: async (_, {accidentId, using_safety, safety_failed, number_package_carried, safety_equipment_used, failed_safety}, context) => {
            const user = await checkUserAuth(context)
               
            try{
                return db.accident.update({
                    where: {
                        id: accidentId
                    },
                    data:{
                        using_safety: using_safety,
                        safety_failed: safety_failed,
                        number_package_carried: number_package_carried,
                        safety_equipment_used: safety_equipment_used,
                        failed_safety: failed_safety,
                    }
                })
            }
            catch(error){
                throw new Error(error)
            }
        }
    }
}