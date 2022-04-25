import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        getDriverByResetToken: async (_, {}, context) => {
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
                        shifts: true,
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
                        accidents: {
                            include: {
                                collisionAccident: {
                                    include: {
                                        injuryAccident: true
                                    }
                                },
                                propertyAccident: true,
                                injuryAccident: true,
                                selfInjuryAccidents: true
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