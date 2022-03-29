import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Query: {
        getOwner: async (_, { id }, context) => {

            try {
                console.log("worked")
                return await db.owner.findUnique({
                    where: {
                        id: id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: true,
                                accidents: {
                                    include: {
                                        propertyAccidents: true,
                                        collisionAccidents: true,
                                        injuryAccidents: true
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
                console.log(error)
                throw new Error(error)
            }
        }
    }
}