import db from "../../../../../utils/generatePrisma.js";
import checkManagerAuth from "../../../../../utils/checkAuthorization/check-manager-auth.js";
import checkOwnerAuth from "../../../../../utils/checkAuthorization/check-owner-auth.js";

export default {
    Mutation: {
        dynamicUpdateAccident: async (_, {
            role,
            accidentId,
            filed,
            deleted,
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
        
            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error('Accident does not exist')
            }

            try {
                return await db.accident.update({
                    where: {
                        id: accidentId
                    },
                    data: {
                        filed: filed,
                        deleted: deleted,
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
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}