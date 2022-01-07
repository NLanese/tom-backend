import db from '../../utils/generatePrisma.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkDriverAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js';

export default {
    Query: {
        getMessages: async (_, context) => {
            try {
                return await db.messages.findMany({
                    include: {
                        driver: true,
                        admin: true
                    },
                    orderBy: [
                        {
                            id: 'desc'
                        },
                    ]
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        adminGetMessagesWithDriver: async (_, { driverId }, context) => {
            const admin = await checkAdminAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) {
                throw new Error('Error: Driver does not exist')
            }

            const verified = handleAdminUserOwnership(admin.id, foundDriver.id)

            try {
                if (verified) {
                    return await db.messages.findMany({
                        where: {
                            driverId: foundDriver.id,
                        },
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        getMessageWithAdmin: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                }
            })

            if (!foundDriver) {
                throw new Error('Error: Driver does not exist')
            }

            const admin = await db.admin.findUnique({
                where: {
                    id: foundDriver.adminId
                }
            })

            if (!admin) {
                throw new Error('Error: Admin does not exist')
            }

            const verified = handleAdminUserOwnership(admin.id, foundDriver.id)

            try {
                if (verified) {
                    return await db.messages.findMany({
                        where: {
                            driverId: foundDriver.id,
                        },
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        sendMessageToAdmin: async (_, { content }, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                }
            })

            if (!foundDriver) {
                throw new Error('Error: Driver does not exist')
            }

            const admin = await db.admin.findUnique({
                where: {
                    id: foundDriver.adminId
                }
            })

            if (!admin) {
                throw new Error('Error: Admin does not exist')
            }

            const verified = await handleAdminUserOwnership(admin.id, driver.id)

            try {
                if (verified) {
                    const message = await db.messages.create({
                        data: {
                            content: content,
                            from: foundDriver.firstname,
                            driver: {
                                connect: {
                                    id: driver.id
                                }
                            },
                            admin: {
                                connect: {
                                    id: admin.id
                                }
                            }    
                        }
                    })

                    await db.notifiedMessages.create({
                        data: {
                            admin: {
                                connect: {
                                    id: admin.id
                                },
                            },
                            content: content,
                            type: 'message',
                            from: foundDriver.firstname
                        }
                    })

                    await db.admin.update({
                        where:{
                            id: admin.id
                        },
                        data: {
                            notified: true
                        }
                    })

                    return message
                } 
            } catch (error) {
                throw new Error(error)
            }
        },

        adminSendMessageToDriver: async (_, { driverId, content }, context) => {
            const admin = await checkAdminAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) {
                throw new Error('Error: Driver does not exist')
            }

            const adminObj = await db.admin.findUnique({
                where: {
                    id: admin.id
                }
            })

            const verified = await handleAdminUserOwnership(admin.id, foundDriver.id)

            try {
                if (verified) {
                    const message = await db.messages.create({
                        data: {
                            content: content,
                            from: adminObj.firstname,
                            driver: {
                                connect: {
                                    id: foundDriver.id
                                }
                            },
                            admin: {
							    connect: {
								    id: admin.id
							    }
                            } 
                        }
                    })

                    await db.notifiedMessages.create({
                        data: {
                            content: content,
                            type: 'message',
                            from: adminObj.firstname,
                            driver: {
                                connect: {
                                    id: driverId
                                },
                            },
                        }
                    })

                    await db.driver.update({
                        where:{
                            id: driverId
                        },
                        data: {
                            notified: true
                        }
                    })

                    return message
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}