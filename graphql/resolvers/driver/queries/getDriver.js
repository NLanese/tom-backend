import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        getDriver: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.driver.findUnique({
                    where: {
                        id: driver.id
                    },
                    include: {
                        owner: true,
                        managers: true,
                        dsp: true,
                        shiftPlanners: true,
                        chatrooms: {
                            include: {
                                messages: true
                            }
                        },
                        weeklyReport: {
                            orderBy: [
                                {
                                    date: "desc"
                                }
                            ]
                        },
                        accidents: true,
                        shiftPlanners: true /* {
                            orderBy: [
                                {
                                    date: "desc"
                                }
                            ]
                        }, */
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}