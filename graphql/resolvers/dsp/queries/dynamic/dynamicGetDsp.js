import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetDsp: async (_, { role }, context) => {
            let owner;
            let manager;
            let dspId;

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
                        dsp: {
                            include: {
                                shiftPlannerDates: true
                            }
                        }
                    }
                })

                if (!foundOwner) {
                    throw new Error('Owner does not exist')
                }

                dspId = await foundOwner.dsp.id
            }

            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        dsp: {
                            include: {
                                shiftPlannerDates: true
                            }
                        }
                    }
                })

                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

                dspId = await foundManager.dsp.id
            }

            const foundDsp = await db.dsp.findUnique({
                where: {
                    id: dspId
                },
                include: {
                    shiftPlannerDates: true
                }
            })

            try {
                return await foundDsp
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}