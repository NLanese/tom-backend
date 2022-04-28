import db from "../../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../../utils/checkAuthorization/check-owner-auth.js";
import handleDriverOwnership from "../../../../../../utils/handleOwnership/handleDynamicOwnership/handleDriverOwnership.js";

export default {
    Mutation: {
        dynamicCreateAccident: async (_, {
            role,
            driverId,
            name,
            date,
            time,
            location,
            amazon_logo,
            vehicleId,
            number_packages_carried,
            police_report_information,
            general_pictures,
            weather,
            rushed_prior,
            distracted,
            extra_info,
            actions_before_accidents,
            unsafe_conditions
        }, context) => {
            let owner;
            let manager;

            // DYNAMIC AUTHORIZATION CHECK
            if (role === 'OWNER') owner = await checkOwnerAuth(context)
            if (role === 'MANAGER') manager = await checkManagerAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driverId
                }
            })

            if (!foundDriver) {
                throw new Error('Driver does not exist')
            }

            if (manager) {
                await handleDriverOwnership(role, manager.id, driverId)
            }

            if (owner) {
                await handleDriverOwnership(role, owner.id, driverId)
            }

            try {
                return await db.accident.create({
                    data: {
                        name: name,
                        date: date,
                        time: time,
                        location: location,
                        amazon_logo: amazon_logo,
                        vehicleId: vehicleId,
                        number_packages_carried: number_packages_carried,
                        police_report_information: police_report_information,
                        general_pictures: general_pictures,
                        weather: weather,
                        rushed_prior: rushed_prior,
                        distracted: distracted,
                        extra_info: extra_info,
                        actions_before_accidents: actions_before_accidents,
                        unsafe_conditions: unsafe_conditions,
                        driver: {
                            connect: {
                                id: driverId
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