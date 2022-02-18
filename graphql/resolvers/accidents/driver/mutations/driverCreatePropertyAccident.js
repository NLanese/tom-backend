import db from "../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js"

export default {
    Mutation: {
        driverCreatePropertyAccident: async (_, {
            accidentId,
            address,
            object_hit,
            specific_pictures,
            safety_equipment,
            contact_info,
            extra_info
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverAccidentOwnership(driver.id, accidentId)

            try {
                return await db.propertyAccident.create({
                    data: {
                        address: address,
                        object_hit: object_hit,
                        specific_pictures: specific_pictures,
                        safety_equipment: safety_equipment,
                        contact_info: contact_info,
                        extra_info: extra_info,
                        accident: {
                            connect: {
                                id: accidentId
                            }
                        },
                        accidentId: accidentId  
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}