import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        refreshOwner: async (_, {token, role}) => {
            let owner = checkOwnerAuth(token)
            try {
                return await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: true,
                                dsp: true,
                                accidents: {
                                    include: {
                                        propertyAccidents: true,
                                        collisionAccidents: true,
                                        injuryAccidents: true
                                    }
                                },
                                notifiedMessages: true
                            }
                        },
                        managers: true,
                        dsp: {
                            include: {
                                shifts: {
                                    orderBy: {
                                        date: 'asc'
                                    }
                                },
                                notifiedMessages: true,
                                announcementMessages: true,
                                devices: {
                                    orderBy: {
                                        deviceIndex: 'asc'
                                    }
                                }
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