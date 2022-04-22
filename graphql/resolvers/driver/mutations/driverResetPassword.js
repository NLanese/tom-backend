import db from "../../../../utils/generatePrisma.js";
import checkDriverAuth from "../../../../utils/checkAuthorization/check-driver-auth.js";
import hashPassword from "../../../../utils/passwordHashing.js";

export default {
    Mutation: {
        driverResetPassword: async (_, {
            password,
            token
        }, context) => {

            const foundDriver = await db.driver.findFirst({
                resetPasswordToken: token
            })

            if (!foundDriver){
                throw new Error("Error, there is no driver with this code, or this code has expired. Please get another code from your Mobile App")
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