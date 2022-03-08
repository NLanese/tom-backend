import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Query: {
        getOwner: async (_, {}, context) => {
            const owner = await checkOwnerAuth(context)

            try {
                return await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: true,
                                accidents: {
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
                                }
                            }
                        },
                        managers: true,
                        dsp: {
                            include: {
                                shiftPlannerDates: true
                            }
                        },
                        messages: true,
                        notifiedMessages: true,
                        chatrooms: {
                            include: {
                                owner: true,
                                managers: true,
                                drivers: true,
                                messages: true
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