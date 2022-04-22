import e from "express";
import db from "../../../../utils/generatePrisma.js";
import generateForgotPasswordToken from "../../../../utils/generateToken/generateForgotPasswordToken.js";
import crypto from "crypto"
import nodemailer from 'nodemailer'
import dotenv from "dotenv";


export default {
    Mutation: {
        driverForgotPassword: async (_, {
            email
        }, context) => {
            

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            let token = generateForgotPasswordToken(email)

            const conflictingDriver = await db.driver.findFirst({
                where: {
                    resetPasswordToken: token
                }
            })

            if (conflictingDriver){
                token = generateForgotPasswordToken(generateForgotPasswordToken(email))
            }
            
            console.log(Date.now())

            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: `Reset your TOM App Password`,
                text: `Enter the following code on your Phone App to reset your password: \n${token}`
              }
              
            email = email.toUpperCase()

            // Finds the driver using the given email
            const foundDriver = await db.driver.findUnique({
                where: {
                    email: email
                }
            })

            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                  throw new Error('Something went wrong, please try again \n' + error)
                } 
            })
              

            if (foundDriver){
                try{
                    return await db.driver.update({
                        where: {
                            id: foundDriver.id
                        },
                        data: {
                            resetPasswordToken: token
                        }
                    })
                } catch (error){
                    console.log(error)
                    throw new Error(error)
                }
            }
            else{
                console.log("No driver of this email found")
                throw new Error("Error: This email is not associated with any account")
            }


        }
    }
}