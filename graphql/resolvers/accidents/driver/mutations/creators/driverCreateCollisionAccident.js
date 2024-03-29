import db from "../../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        driverCreateCollisionAccident: async (_, {
            accidentId,
            specific_pictures,
            contact_info,
            collision_report,
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
               
                return await db.collisionAccident.create({
                    data: {
                        specific_pictures: specific_pictures,
                        contact_info: contact_info,
                        collision_report: collision_report,
                        extra_info: extra_info,
                        // accidentId: foundAccident.id,
                        accident: {
                            connect: {
                                id: foundAccident.id
                            }
                        }            
                    }
                }).then( (resolved) => {
                    return resolved
                })
            } catch (error) {
                throw new Error(error)
            }


        }
    }
}