import checkAuth from '../../utils/check-auth.js';
import db from '../../utils/generatePrisma.js';

export default{
    Query: {
        getAccidents: async (_, {}, context) => {
            const user = await checkAuth(context)

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
        createAccident: async (_, {using_safety, safety_failed, number_package_carried, safety_equipment_used, failed_safety}, context) => {
            const user = await checkAuth(context)
            
            try{
                return db.accident.create({
                    using_safety: using_safety,
                    safety_failed: safety_failed,
                    number_package_carried: number_package_carried,
                    safety_equipment_used: safety_equipment_used,
                    failed_safety: failed_safety
                })
            }
            catch(error){
                throw new Error(error)
            }
        }
    }
}