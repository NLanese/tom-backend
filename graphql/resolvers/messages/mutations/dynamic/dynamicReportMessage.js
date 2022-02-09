import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        dynamicReportMessage: async (_, {
            role,
            messageId
        }, context) => {
            let owner;
            let manager;
            let driver;
            let reportedBy;

            // Dynamic authorization check
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)
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
                    console.log(error)
                    throw new Error(error)
                }
            }
        }
    }
}