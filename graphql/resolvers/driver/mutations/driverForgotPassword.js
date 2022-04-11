import e from "express";
import db from "../../../../utils/generatePrisma.js";
import generateDriverToken from "../../../../utils/generateToken/generateDriverToken.js"


export default {
    Mutation: {
        driverForgotPassword: async (_, {
            email
        }, context) => {

            // Finds the driver using the given email
            const foundDriver = await db.driver.findUnique({
                where: {
                    email: email
                }
            })

            let token = generateDriverToken(email)

            if (foundDriver){
                return await db.driver.update({
                    where: {
                        id: foundDriver.id
                    },
                    data: {
                        resetPasswordToken: token
                    }
                })
            }
            else{
                throw new Error("Error: This email is not associated with any account")
            }


        }
    }
}