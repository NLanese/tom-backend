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

    }
}