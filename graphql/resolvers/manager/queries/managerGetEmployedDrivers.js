import db from "../../../../utils/generatePrisma.js";
import checkAdminAuth from "../../../../utils/checkAuthorization/check-admin-auth.js"

export default {
    Query: {
        managerGetEmployedDrivers: async (_, {}, context) => {
            const manager = await checkAdminAuth(context)

            const foundManager = await db.admin.findUnique({
                where: {
                    id: manager.id
                },
                include: {
                    owner: true
                }
            })

            if (!foundManager) {
                throw new Error('Manager does not exist')
            }

            try {
                return await db.driver.findMany({
                    where: {
                        ownerId: foundManager.owner.id,
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