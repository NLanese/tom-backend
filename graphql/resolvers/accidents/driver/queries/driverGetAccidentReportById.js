import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        driverGetAccidentReportById: async (_, { accidentId }, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.accident.findUnique({
                    where: {
                        id: accidentId
                    },
                    include: {
                        propertyAccident: {
                        },
                        collisionAccident: {
                            include: {
                                injuryAccident: true
                            }
                        },
                        injuryAccident: true,
                        selfInjuryAccidents: true
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}