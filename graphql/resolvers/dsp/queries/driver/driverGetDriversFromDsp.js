import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        driverGetDriversFromDsp: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                },
                include: {
                    dsp: true
                }
            })

            if (!foundDriver) {
                throw new Error('Driver does not exist')
            }

            try {
                return await db.dsp.findUnique({
                    where: {
                        id: foundDriver.dsp.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: true
                            }
                        }
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}