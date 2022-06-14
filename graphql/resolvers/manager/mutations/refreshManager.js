import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";
import db from "../../../../utils/generatePrisma.js";
export default {
    Mutation: {
        refreshManager: async (_, { role, token} ) => {
            let manager = checkManagerAuth(token)
            try {
                return await db.manager.findUnique({
                    where: {
                        id:  manager.id
                    },
                    include: {
                        owner: true,
                        drivers: {
                            include: {
                                weeklyReport: {
                                    orderBy: {
                                        date: 'desc'
                                    },
                                },
                                dsp: true,
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
                                shifts: {
                                    orderBy: {
                                        date: 'asc'
                                    }
                                },
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
                throw new Error(error)
            }
        }
    }
}