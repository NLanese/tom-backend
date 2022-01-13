import db from '../../utils/generatePrisma.js';
import checkAdminAuth from '../../utils/checkAuthorization/check-admin-auth.js';
import checkDriverAuth from '../../utils/checkAuthorization/check-driver-auth.js';
import handleAdminUserOwnership from '../../utils/handleOwnership/handleAdminOwnership/handleAdminUserOwnership.js';

export default {
    Query: {
        getNotifiedMessages: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.notifiedMessages.findMany({
                    where: {
                        driverId: driver.id
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
        }
    },

    Mutation: {
        readNotifiedMessage: async (_, { notifiedMessageId }, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.notifiedMessages.update({
                    where: {
                        id: notifiedMessageId
                    },
                    data: {
                        read: true 
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        notifiedToFalse: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.driver.update({
                    where: {
                        id: driver.id
                    },
                    data: {
                        notified: false
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}