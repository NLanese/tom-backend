import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicReportMessage: async (_, {
            role,
            messageId,
            token
        }) => {
            let owner;
            let manager;
            let driver;
            let reportedBy;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(token)
            if (role === 'MANAGER') manager = await checkManagerAuth(token)
            if (role === 'DRIVER') driver = await checkDriverAuth(context)

            if (owner) {
                reportedBy = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    }
                })
            }
            if (manager) {
                reportedBy = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    }
                })
            }
            if (driver) {
                reportedBy = await db.driver.findUnique({
                    where: {
                        id: driver.id
                    }
                })
            }

            if (!reportedBy) {
                throw new Error('User reporting the message does not exist')
            }

            const foundMessage = await db.messages.findUnique({
                where: {
                    id: messageId
                }
            })

            if (!foundMessage) {
                throw new Error('Message does not exist')
            }

            if (owner || manager || driver) {
                try {
                    return await db.messages.update({
                        where: {
                            id: messageId
                        },
                        data: {
                            reported: true,
                            reportedBy: reportedBy
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}