import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";

export default {
    Mutation: {
        driverResetPassword: async (_, {
            password,
            token
        }, context) => {
            const driver = await checkDriverAuth(context)

            const foundDriver = await db.driver.findUnique({
                where: {
                    id: driver.id
                }
            })

            if (token !== foundDriver.resetPasswordToken) {
                throw new Error('Token is not correct')
            }

            if (Date.now() <= foundDriver.resetPasswordTokenExpiration) {
                throw new Error('Token is expired')
            }

            password = await hashPassword(password)

            try {
                return await db.driver.update({
                    where: {
                        id: driver.id
                    },
                    data: {
                        password: password
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}