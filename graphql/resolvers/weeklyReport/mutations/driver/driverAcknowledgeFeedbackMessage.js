import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        driverAcknowledgeFeedbackMessage: async (_, { reportId }, context) => {
            const driver = await checkDriverAuth(context)
            let date = Date(Date.now());
            date = date.toString()

            try {
                return await db.weeklyReport.update({
                    where: {
                        id: reportId
                    },
                    data: { 
                        acknowledged: true,
                        acknowledgedAt: date
                    }
                })
            } catch(error) {
                throw new Error(error)
            }
        }
    }
}