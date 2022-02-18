import db from "../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js"

export default {
    Mutation: {
        driverUpdateAccident: async (_, {
            accidentId,
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
            unsafe_coditions
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundAccident = await db.accident.findUnique({
                where: {
                    id: accidentId
                }
            })

            if (!foundAccident) {
                throw new Error("Accident does not exist")
            }

            await handleDriverAccidentOwnership(driver.id, accidentId)

            try {
                return await db.accident.update({
                    where: {
                        id: accidentId
                    },
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
                        unsafe_conditions: unsafe_coditions
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}