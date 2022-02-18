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
                            include: {
                                injuryAccident: true
                            }
                        },
                        collisionAccident: {
                            include: {
                                injuryAccident: true
                            }
                        },
                        injuryAccident: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}