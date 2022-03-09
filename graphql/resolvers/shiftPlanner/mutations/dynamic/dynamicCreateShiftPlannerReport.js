import db from "../../../../../utils/generatePrisma.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js"
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";

export default {
    Mutation: {
        dynamicCreateShiftPlannerReport: async (_, {
            role,
            driverId,
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
            weekStartDate,
            weekEndDate
        }, context) => {
            let owner;
            let manager;
            let newDateArr = [];
            let dateExist = false;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) throw new Error("Driver does not exist")

            if (owner) {
                try {
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

                    await foundOwner.dsp.shiftPlannerDates.dates.forEach((date) => {
                        if (date === weekStartDate) {
                            dateExist = true
                        }
                    })

                    if (dateExist === false) {
                        newDateArr = await foundOwner.dsp.shiftPlannerDates.dates
                        await newDateArr.push(weekStartDate)
                        
                        await db.shiftPlannerDates.update({
                            where: {
                                id: foundOwner.dsp.shiftPlannerDates.id
                            },
                            data: {
                                dates: newDateArr
                            }
                        })
                    }

                    if (dateExist === true) {
                        throw new Error('Date already exist')
                    }

                    return await db.shiftPlanner.create({
                        data: {
                            driver: {
                                connect: {
                                    id: driverId
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
                            weekStartDate: weekStartDate,
                            weekEndDate: weekEndDate
                        }
                    })
                } catch (error) {
                    console.log(error)
                    throw new Error(error)
                }
            }

            // NEED TO FIX MANAGER
            if (manager) {
                try {
                    return await db.shiftPlanner.create({
                        data: {
                            driver: {
                                connect: {
                                    id: driverId
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
                            weekStartDate: weekStartDate,
                            weekEndDate: weekEndDate
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