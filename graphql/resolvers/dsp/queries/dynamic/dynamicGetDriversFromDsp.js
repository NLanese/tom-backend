import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetDriversFromDsp: async (_, { role }, context) => {
            let owner;
            let manager;

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(context)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(context)
            }

            if (owner) {
                let owner;
            let manager;

            if (role === 'OWNER') {
                owner = await checkOwnerAuth(context)
            }

            if (role === 'MANAGER') {
                manager = await checkManagerAuth(context)
            }

                try {
                    return await db.driver.findMany({
                        where: {
                            dspId: foundOwner.dsp.id
                        },
                        include: {
                            owner: true,
                            managers: true,
                            dsp: true,
                            messages: true,
                            notifiedMessages: true,
                            weeklyReport: {
                                orderBy: [
                                    {
                                        date: "desc"
                                    }
                                ]
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                const foundManager = await db.manager.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        dsp: true
                    }
                })

                if (!foundManager) {
                    throw new Error('Manager does not exist')
                }

                try {
                    return await db.driver.findMany({
                        where: {
                            dspId: foundManager.dsp.id
                        },
                        include: {
                            owner: true,
                            managers: true,
                            dsp: true,
                            messages: true,
                            notifiedMessages: true,
                            weeklyReport: {
                                orderBy: [
                                    {
                                        date: "desc"
                                    }
                                ]
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error("Something went wrong. Please try again")
        }
    }
}