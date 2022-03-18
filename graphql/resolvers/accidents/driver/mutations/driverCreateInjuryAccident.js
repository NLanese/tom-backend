import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js";

export default {
    Mutation: {
        driverCreateInjuryAccident: async (_, {
            accidentId,
            collisionAccidentId,
            contact_info,
            extra_info,
            injured_areas, 
            injury_report,
            pain_level,
            specific_pictures
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

            if (collisionAccidentId === undefined) {
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


            if (collisionAccidentId !== undefined) {
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
                            collisionAccident: {
                                connect: {
                                    id: collisionAccidentId
                                }
                            },
                        }
                    })
                } catch (error) {
                    console.log(error)
                    throw new Error(error)
                }
            }

            throw new Error("Please provide an accident ID")
        }
    }
}