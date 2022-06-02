import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicRefreshUser: async (_, { role, token }) => {
            //////////////////
            // Verification //
            //////////////////
            let user = false
            if (role === "OWNER"){ 
                user = checkOwnerAuth(token) 
                if (!user){ throw new Error("Invalid Crudentials")}
                try {
                    return await db.owner.findUnique({
                        where: {
                            id: user.id
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
            else if (role === "MANAGER"){ 
                user === checkManagerAuth(token)
                if (!user){ throw new Error("Invalid Crudentials")}
                try {
                    return await db.manager.findUnique({
                        where: {
                            id: user.id
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
}