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
            let datesArray;

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

            const foundShiftPlannerDates = await db.shiftPlannerDates.findUnique({
                where: {
                    id: dspRecord.shiftPlannerDates.id
                }
            })

            datesArray = await foundShiftPlannerDates.dates

            await dates.forEach((date) => {    
                if (datesArray.includes(date) === false) {
                    datesArray.push(date)
                }
            })

            return await db.shiftPlannerDates.update({
                where: {
                    id: dspRecord.shiftPlannerDates.id
                },
                data: {
                    dates: datesArray
                }
            })
        }
    }
}