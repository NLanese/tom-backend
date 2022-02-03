import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        getDriversFromDsp: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                },
                include: {
                    dsp: true
                }
            })

            try {
                return await db.driver.findMany({
                    where: {
                        dspId: foundDriver.dsp.id
                    },
                    include: {
                        weeklyReport: {
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