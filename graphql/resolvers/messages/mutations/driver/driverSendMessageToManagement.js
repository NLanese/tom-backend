import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Mutation: {
        driverSendMessageToManagement: async (_, { content }, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                },
                include: {
                    owner: true,
                    admins: true
                }
            })

            if (!foundDriver) {
                throw new Error('Error: Driver does not exist')
            }
            
        }
    }
}