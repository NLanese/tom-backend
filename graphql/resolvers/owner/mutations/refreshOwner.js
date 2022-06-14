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
                                accidents: {
                                    include: {
                                        injuryAccidents: true,
                                        propertyAccidents: true,
                                        collisionAccidents: true,
                                        selfInjuryAccidents: true
                                    }
                                },
                                weeklyReport: {
                                    orderBy: {
                                        date: 'desc'
                                    },
                                },
                            }
                        },
                        managers: true,
                        dsp: {
                            include: {
                                owner: true,
                                notifiedMessages: true,
                                announcementMessages: true,
                                devices: {
                                    orderBy: {
                                        deviceIndex: 'asc'
                                    }
                                },
                            }
                        },
                        messages: true,
                        // notifiedMessages: true,
                        chatrooms: {
                            include: {
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