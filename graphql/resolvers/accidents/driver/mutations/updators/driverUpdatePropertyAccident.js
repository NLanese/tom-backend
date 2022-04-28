import db from "../../../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverPropertyAccidentOwnership from "../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverPropertyAccidentOwnership.js"

export default {
    Mutation: {
        driverUpdatePropertyAccident: async (_, {
            propertyAccidentId,
            address,
            object_hit,
            specific_pictures,
            safety_equipment,
            contact_info,
            extra_info
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundPropertyAccident = await db.propertyAccident.findUnique({
                where: {
                    id: propertyAccidentId
                }
            })

            if (!foundPropertyAccident) {
                throw new Error("Property Accident does not exist")
            }

            await handleDriverPropertyAccidentOwnership(driver.id, propertyAccidentId)

            try {
                return await db.propertyAccident.update({
                    where: {
                        id: propertyAccidentId
                    },
                    data: {
                        address: address,
                        object_hit: object_hit,
                        specific_pictures: specific_pictures,
                        safety_equipment: safety_equipment,
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