import db from "../../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        driverCreateSelfInjuryAccident: async (_, {
            animal_report,
            injuries, 
            injury_report,
            extra_info,
            specific_pictures,
            accidentId
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
                return await db.selfInjuryAccident.create({
                    data: {
                        animal_report: animal_report,
                        injuries: injuries, 
                        injury_report: injury_report,
                        extra_info: extra_info,
                        specific_pictures: specific_pictures,
                        // accidentId: foundAccident.id,
                        accident: {
                            connect: {
                                id: foundAccident.id
                            }
                        },
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}