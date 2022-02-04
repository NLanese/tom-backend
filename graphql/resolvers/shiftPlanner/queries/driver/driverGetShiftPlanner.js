import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        driverGetShiftPlaner: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.driver.findUnique({
                    where: {
                        id: driver.id
                    },
                    include: {
                        shiftPlanners: {
                            orderBy: [
                                {
                                    date: "desc"
                                }
                            ]
                        }
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}