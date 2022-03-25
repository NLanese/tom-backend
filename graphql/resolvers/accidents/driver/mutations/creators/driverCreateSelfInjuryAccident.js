import db from "../../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        driverCreateSelfInjuryAccident: async (_, {
            id,
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
                return await db.injuryAccident.create({
                    data: {
                        injured_areas: injured_areas,
                        injury_report: injury_report,
                        contact_info: contact_info,
                        specific_pictures: specific_pictures,
                        pain_level: pain_level,
                        extra_info: extra_info,
                        accident: {
                            connect: {
                                id: accidentId
                            }
                        },
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}