import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        driverGetManagers: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                }
            })

            const foundOwner = await db.owner.findUnique({
                where: {
                    id: foundDriver.ownerId
                },
                include: {
                    managers: true
                }
            })

            return foundOwner.managers
        }
    }
}