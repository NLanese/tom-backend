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

///////////////////////////////////
///                             ///
///      Mail Configuration     ///
///                             ///
///////////////////////////////////

            // Creates the means of sending the email
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            // Generates resetToken
            let token = generateForgotPasswordToken(email)

            // Finds if any other driver has the same token somehow
            const conflictingDriver = await db.driver.findFirst({
                where: {
                    resetPasswordToken: token
                }
            })

            let randomizer = email + Math.random().toString()
            // Rerandomizes the token 
            if (conflictingDriver){
                token = generateForgotPasswordToken(generateForgotPasswordToken(randomizer))
            }

            // let code = `http://thetomapp.com/resetPassword/${token}`         // Deployed
            let code = 'https://www.thetomapp.com/reset-password/${token}'
            // let code = `http://localhost:3000/resetPassword/${token}`           // Testing

            let today = Date.now()
            let expire = (today + 18000000).toString()

            // Configures the actual Email Content
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: `Reset your TOM App Password`,
                text: `Please click the link provided to be sent to the Reset Password page: \n${code}`
              }
            email = email.toUpperCase()

            // Finds the driver using the given email
            const foundDriver = await db.driver.findUnique({
                where: {
                    email: email
                }
            })

            // SENDS the email through the transporter
            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                  throw new Error('Something went wrong, please try again \n' + error)
                } 
            })
    
              
///////////////////////////////////
///                             ///
///           Mutation          ///
///                             ///
///////////////////////////////////

            if (foundDriver){
                try{
                    return await db.driver.update({
                        where: {
                            id: foundDriver.id
                        },
                        data: {
                            resetPasswordToken: token,
                            resetPasswordTokenExpiration: expire
                        }
                    }).then( mutation => {
                        return mutation
                    })
                } catch (error){
                    throw new Error(error)
                }
            }
            else{
                throw new Error("Error: This email is not associated with any account")
            }


        }
    }
}