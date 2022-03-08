import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        dynamicUpdateShiftPlannerDates: async (_, {
            shiftPlannerDatesId,
            role,
            dates
        }, context) => {
            let owner;
            let manager;
            let dspRecord;

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

                dspRecord = foundOwner.dsp
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

                dspRecord = foundManager.dsp
            }

            await console.log(dspRecord)
        }
    }
}