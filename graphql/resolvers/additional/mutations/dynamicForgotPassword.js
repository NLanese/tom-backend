import db from "../../../../utils/generatePrisma.js";
import generateForgotPasswordToken from "../../../../utils/generateToken/generateForgotPasswordToken.js";
import nodemailer from 'nodemailer'


export default {
    Mutation: {
        dynamicForgotPassword: async (_, {email}, context) => {
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
            const conflictingEmail = await db.owner.findFirst({
                where: {
                    resetPasswordToken: token
                }
            })

            const otherConflictingEmqil = await db.manager.findFirst({
                where: {
                    resetPasswordToken: token
                }
            })

            let randomizer = email + Math.random().toString()
            // Rerandomizes the token 
            if (conflictingEmail || otherConflictingEmqil){
                token = generateForgotPasswordToken(generateForgotPasswordToken(randomizer))
            }

            let code = `https://dashboard.thetomapp.com/authentication/password-reset-key?key=${token}`

            let today = Date.now()
            console.log(today)
            let expire = `${today + 18000000}`
            console.log(expire)

            // Configures the actual Email Content
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: `Reset your TOM App Password`,
                text: `Please click the link provided to be sent to the Reset Password page: \n${code}`
              }
            email = email.toUpperCase()

            let user
            let tableType

             // Finds the driver using the given email
            const foundOwner = await db.owner.findUnique({
                where: {
                    email: email
                }
            })
            if (!foundOwner){
                const foundManager = await db.manager.findUnique({
                    where: {
                        email: email
                    }
                })
                user = foundManager
                tableType = 'manager'
            }
            else{
                user = foundOwner
                tableType = "owner"
            }



            // SENDS the email through the transporter
            transporter.sendMail(mailOptions, (error, response) => {
                if (error){
                  throw new Error('Something went wrong, please try again \n' + error)
                } 
            })

            if (user){
                if (tableType === "owner"){
                    try{
                        await db.owner.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                resetPasswordToken: token,
                                resetPasswordTokenExpiration: parseInt(expire, 10)
                            }
                        })
                        return "Email Sent"
                    } catch (error){
                        console.log(error)
                        throw new Error(error)
                    }
                }
                else{
                    try{
                        await db.manager.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                resetPasswordToken: token,
                                resetPasswordTokenExpiration: expire
                            }
                        })
                        return "Email Sent"
                    } catch (error){
                        throw new Error(error)
                    }
                }
                
            }
            else{
                throw new Error("Error: This email is not associated with any account")
            }
        }
    }
}