import db from "../../../../../utils/generatePrisma.js"
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"
import handleDriverAccidentOwnership from "../../../../../utils/handleOwnership/handleDriverOwnership/handleDriverAccidentOwnership.js"

export default {
    Mutation: {
        driverUpdateAccident: async (_, {
            accidentId,
            name,
            date,
            time,
            location,
            accident_report,
            has_logo,
            police_report,
            before_accident_report,
            selfDamage,
            weather_and_distractions
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
                        accident_report: accident_report,
                        has_logo: has_logo,
                        police_report: police_report,
                        before_accident_report: before_accident_report,
                        selfDamage: selfDamage,
                        weather_and_distractions: weather_and_distractions
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}