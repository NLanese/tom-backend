import e from "express";
import db from "../../../../utils/generatePrisma.js";
import generateDriverToken from "../../../../utils/generateToken/generateDriverToken.js"
import crypto from "crypto"



export default {
    Mutation: {
        driverForgotPassword: async (_, {
            email
        }, context) => {
            
            // Accesses the hidden .env file
            require("dotenv").config()

            const transporter = nodemailer.createTransport({
                service: "e",
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  password: `${process.env.EMAIL_PASSWORD}`
                }
            })


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