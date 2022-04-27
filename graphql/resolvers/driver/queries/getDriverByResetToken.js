import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        getDriverByResetToken: async (_, {token}) => {
            try {
                return await db.driver.findUnique({
                    where: {
                        resetPasswordToken: token
                    },
                    include: {
                        owner: true,
                        managers: true,
                        dsp: true,
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
                                collisionAccidents: {
                                    include: {
                                        injuryAccidents: true
                                    }
                                },
                                propertyAccidents: true,
                                injuryAccidents: true,
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