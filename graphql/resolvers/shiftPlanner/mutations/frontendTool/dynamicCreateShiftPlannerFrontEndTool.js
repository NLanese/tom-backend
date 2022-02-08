import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-admin-auth.js";

export default {
    Mutation: {
        dynamicCreateShiftPlannerFrontEndTool: async (_, {
            role,
            transporterId,
            date,
            phoneId,
            deviceId,
            vehicleId,
            cxNumber,
            message
        }, context) => {
            let owner;
            let manager;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    transporterId: transporterId
                }
            })

            if (!foundDriver) throw new Error("Driver does not exist")

            if (owner) {
                try {
                    return await db.shiftPlanner.create({
                        data: {
                            driver: {
                                connect: {
                                    id: foundDriver.id
                                }
                            },
                            date: date,
                            phoneId: phoneId,
                            deviceId: deviceId,
                            vehicleId: vehicleId,
                            cxNumber: cxNumber,
                            message: message
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (manager) {
                try {
                    return await db.shiftPlanner.create({
                        data: {
                            driver: {
                                connect: {
                                    id: foundDriver.id
                                }
                            },
                            phoneId: phoneId,
                            deviceId: deviceId,
                            vehicleId: vehicleId,
                            cxNumber: cxNumber,
                            message: message
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            throw new Error("Role not found")
        }
    }
}