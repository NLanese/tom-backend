import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        ownerGetDrivers: async (_, {}, context) => {
            const owner = await checkOwnerAuth(context)

            try {
                return await db.driver.findMany({
                    where: {
                        ownerId: owner.id,
                        deleted: false
                    },
                    include: {
                        accidents: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}