import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicCreateShiftPlannerFrontEndTool: async (_, {
            role,
            transporterId,
            phoneId,
            deviceId,
            vehicleId,
            cxNumber,
            message,
            sundayDate,
            sundayHours,
            mondayDate,
            mondayHours,
            tuesdayDate,
            tuesdayHours,
            wednesdayDate,
            wednesdayHours,
            thursdayDate,
            thursdayHours,
            fridayDate,
            fridayHours,
            saturdayDate,
            saturdayHours,
            weekStartDay,
            weekEndDay
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
                            phoneId: phoneId,
                            deviceId: deviceId,
                            vehicleId: vehicleId,
                            cxNumber: cxNumber,
                            message: message,
                            sundayDate: sundayDate,
                            sundayHours: sundayHours,
                            mondayDate: mondayDate,
                            mondayHours: mondayHours,
                            tuesdayDate: tuesdayDate,
                            tuesdayHours: tuesdayHours,
                            wednesdayDate: wednesdayDate,
                            wednesdayHours: wednesdayHours,
                            thursdayDate: thursdayDate,
                            thursdayHours: thursdayHours,
                            fridayDate: fridayDate,
                            fridayHours: fridayHours,
                            saturdayDate: saturdayDate,
                            saturdayHours: saturdayHours,
                            weekStartDay: weekStartDay,
                            weekEndDay: weekEndDay
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
                            message: message,
                            sundayDate: sundayDate,
                            sundayHours: sundayHours,
                            mondayDate: mondayDate,
                            mondayHours: mondayHours,
                            tuesdayDate: tuesdayDate,
                            tuesdayHours: tuesdayHours,
                            wednesdayDate: wednesdayDate,
                            wednesdayHours: wednesdayHours,
                            thursdayDate: thursdayDate,
                            thursdayHours: thursdayHours,
                            fridayDate: fridayDate,
                            fridayHours: fridayHours,
                            saturdayDate: saturdayDate,
                            saturdayHours: saturdayHours,
                            weekStartDay: weekStartDay,
                            weekEndDay: weekEndDay
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