import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        dynamicSendFeedbackMessage: async (_, {
            role,
            reportId,
            message
        }, context) => {
            let owner;
            let manager;

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(context)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(context)
            }

            if (owner) {
                try {
                    return await db.weeklyReport.update({
                        where: {
                            id: reportId
                        },
                        data: {
                            feedbackMessage: message,
                            feedbackMessageSent: true
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                try {
                    return await db.weeklyReport.update({
                        where: {
                            id: reportId
                        },
                        data: {
                            feedbackMessage: message,
                            feedbackMessageSent: true
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error('You dont have permission to send a message')
        }
    }
}