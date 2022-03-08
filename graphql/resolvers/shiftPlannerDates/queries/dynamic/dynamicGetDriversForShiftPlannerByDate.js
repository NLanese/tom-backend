import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetDriversForShiftPlannerByDate: async (_, {
            role,
            date
        }, context) => {
            let owner;
            let manager;
            let drivers;

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
                        },
                        drivers: {
                            include: {
                                shiftPlanners: true
                            }
                        }
                    }
                })

                drivers = await foundOwner.drivers
            }

            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    }
                })

                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: foundManager.ownerId
                    },
                    include: {
                        dsp: {
                            include: {
                                shiftPlannerDates: true
                            }
                        },
                        drivers: {
                            include: {
                                shiftPlanners: true
                            }
                        }
                    }
                })

                drivers = await foundOwner.drivers
            }

            let returnObjArr;
            
            drivers.forEach((driver) => {
                let returnObj


                driver.shiftPlanners.forEach((shift) => {
                    console.log('hit')
                    console.log(shift)
                })
            })
        }
    }
}