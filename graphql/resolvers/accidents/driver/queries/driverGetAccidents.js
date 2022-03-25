import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        driverGetAccidents: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.accident.findMany({
                    where: {
                        driverId: driver.id
                    },
                    include: {
                        propertyAccident: true,
                        collisionAccident: {
                            include: {
                                injuryAccident: true
                            }
                        },
                        injuryAccident: true,
                        selfInjuryAccident: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}