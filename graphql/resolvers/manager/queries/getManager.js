import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        getManager: async (_, { id }, context) => {

            try {
                return await db.manager.findUnique({
                    where: {
                        id: id
                    },
                    include: {
                        owner: true,
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
                        dsp: {
                            include: {
                                shifts: true,
                                devices: true
                            }
                        },
                        messages: true,
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