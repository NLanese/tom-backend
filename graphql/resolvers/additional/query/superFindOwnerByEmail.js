import db from "../../../../utils/generatePrisma.js"
import dotenv from "dotenv";



export default {
    Query: {
        superFindOwnerByEmail: async (_, { email, code }, context) => {

            if (code != process.env.SUPER_KEY_ONE){
                throw new error("SUPER ACCESS DENIED")
            }

            try {
                return await db.owner.findUnique({
                    where: {
                        email: email
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: {
                                    orderBy: {
                                        date: 'desc'
                                    },
                                },
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