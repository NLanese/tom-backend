import db from "../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../utils/checkAuthorization/check-owner-auth.js"

export default {
    Query: {
        getOwner: async (_, {}, context) => {
            const owner = await checkOwnerAuth(context)

            try {
                return await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: true
                            }
                        },
                        admins: true,
                        dsp: true,
                        messages: true,
                        notifiedMessages: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}