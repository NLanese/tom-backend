import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

// USED FOR TESTING PURPOSES
export default {
    Mutation: {
        dynamicCreateShiftPlannerDates: async (_, {
            role,
            dates
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
                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        dsp: true
                    }
                })

                try {
                    return await db.shiftPlannerDates.create({
                        data: {
                            dates: dates,
                            dsp: {
                                connect: {
                                    id: foundOwner.dsp.id
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