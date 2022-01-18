import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";

export default {
    Query: {
        getDriver: async (_, {}, context) => {
            const driver = await checkDriverAuth(context)

            console.log(await db.driver.findUnique({
                where: {
                    id: driver.id
                },
                include: {
                    owner: true,
                    admin: true
                }
            }))

            try {
                return await db.driver.findUnique({
                    where: {
                        id: driver.id
                    },
                    include: {
                        owner: true,
                        admin: true
                    }
                })
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        }
    }
}