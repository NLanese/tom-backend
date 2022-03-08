import db from "../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Query: {
        getManager: async (_, {}, context) => {
            const manager = await checkManagerAuth(context)

            try {
                return await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        owner: true,
                        drivers: true,
                        dsp: {
                            include: {
                                shiftPlannerDates: true
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