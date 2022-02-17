import db from "../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverCollisionAccidentOwnership from "../../../../utils/handleOwnership/handleDriverOwnership/handleDriverCollisionAccidentOwnership.js"

export default {
    Mutation: {
        driverUpdateCollisionAccident: async (_, {
            collisionAccidentId,
            specific_pictures,
            contact_info,
            extra_info
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundCollisionAccident = await db.collisionAccident.findUnique({
                where: {
                    id: collisionAccidentId
                }
            })

            if (!foundCollisionAccident) {
                throw new Error("Collision Accident does not exist")
            }

            await handleDriverCollisionAccidentOwnership(driver.id, collisionAccidentId)

            try {
                return await db.collisionAccident.update({
                    where: {
                        id: collisionAccidentId
                    },
                    data: {
                        specific_pictures: specific_pictures,
                        contact_info: contact_info,
                        extra_info: extra_info
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}