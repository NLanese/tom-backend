import db from "../../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../../utils/checkAuthorization/check-driver-auth.js"

export default {
    Mutation: {
        driverCreateAccident: async (_, {
            name,
            date,
            time,
            location
        }, context) => {
            const driver = await checkDriverAuth(context)

            try {
                return await db.accident.create({
                    data: {
                        name: name,
                        date: date,
                        time: time,
                        location: location,
                        driver: {
                            connect: {
                                id: driver.id
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