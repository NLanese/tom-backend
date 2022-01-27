import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Query: {
        dynamicGetWeeklyReportsByDate: async (_, {
            role,
            date
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
                let returnData = []

                const foundOwner = await db.owner.findUnique({
                    where: {
                        id: owner.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: {
                                    include: {
                                        driver: true
                                    }
                                }
                            }
                        }
                    }
                })

                await foundOwner.drivers.forEach((driver) => {
                    driver.weeklyReport.forEach((report) => {
                        if (report.date === date) {
                            returnData.push(report)
                        }
                    })
                })

                try {
                    return await returnData
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                let returnData = []

                const foundManager = await db.admin.findUnique({
                    where: {
                        id: manager.id
                    },
                    include: {
                        drivers: {
                            include: {
                                weeklyReport: {
                                    include: {
                                        driver: true
                                    }
                                }
                            }
                        }
                    }
                })

                await foundManager.drivers.forEach((driver) => {
                    driver.weeklyReport.forEach((report) => {
                        if (report.date === date) {
                            returnData.push(report)
                        }
                    })
                })

                try {
                    return await returnData
                } catch (error) {
                    throw new Error(error)
                }
            }
        }
    }
}